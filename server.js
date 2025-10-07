const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active auctions and their current state
  const activeAuctions = new Map();
  
  // Store authenticated users
  const authenticatedUsers = new Map();

  // JWT Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      console.log('Connection attempt without token - allowing as guest');
      socket.data.user = { role: 'guest', userId: null };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.data.user = decoded;
      authenticatedUsers.set(socket.id, decoded);
      console.log(`Authenticated user connected: ${decoded.name} (${decoded.role})`);
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      socket.data.user = { role: 'guest', userId: null };
      next();
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`Client connected: ${socket.id} (${user.role})`);

    // Send user info back to client
    socket.emit('auth-status', {
      authenticated: user.role !== 'guest',
      user: user.role !== 'guest' ? user : null
    });

    // Join auction room
    socket.on('join-auction', (auctionId) => {
      socket.join(`auction-${auctionId}`);
      console.log(`Client ${socket.id} joined auction ${auctionId}`);
      
      // Send current auction state if available
      if (activeAuctions.has(auctionId)) {
        socket.emit('auction-update', activeAuctions.get(auctionId));
      }
    });

    // Leave auction room
    socket.on('leave-auction', (auctionId) => {
      socket.leave(`auction-${auctionId}`);
      console.log(`Client ${socket.id} left auction ${auctionId}`);
    });

    // Handle new bid - REQUIRES AUTHENTICATION
    socket.on('place-bid', (data) => {
      const user = socket.data.user;
      
      // Check if user is authenticated
      if (user.role === 'guest') {
        socket.emit('bid-error', {
          error: 'Authentication required',
          message: 'You must be logged in to place bids'
        });
        console.log(`Unauthorized bid attempt by guest: ${socket.id}`);
        return;
      }

      // Check if user has permission to bid (buyers, sellers, dealers, admins)
      const allowedRoles = ['buyer', 'seller', 'dealer', 'admin'];
      if (!allowedRoles.includes(user.role)) {
        socket.emit('bid-error', {
          error: 'Permission denied',
          message: 'You do not have permission to place bids'
        });
        console.log(`Unauthorized bid attempt by ${user.role}: ${socket.id}`);
        return;
      }

      const { auctionId, bidAmount } = data;
      console.log(`New bid on auction ${auctionId}: ₨${bidAmount} by ${user.name} (${user.role})`);
      
      // Update auction state
      const auctionState = {
        auctionId,
        currentBid: bidAmount,
        bidder: user.name,
        bidderId: user.userId,
        bidderRole: user.role,
        bidCount: (activeAuctions.get(auctionId)?.bidCount || 0) + 1,
        timestamp: new Date().toISOString()
      };
      
      activeAuctions.set(auctionId, auctionState);
      
      // Broadcast to all clients in the auction room
      io.to(`auction-${auctionId}`).emit('bid-placed', auctionState);
      
      // Send success confirmation to bidder
      socket.emit('bid-success', {
        message: 'Bid placed successfully',
        auctionId,
        bidAmount
      });
    });

    // Handle auction status updates (admin only)
    socket.on('auction-status-update', (data) => {
      const user = socket.data.user;
      
      // Check if user is admin
      if (user.role !== 'admin') {
        socket.emit('error', {
          error: 'Permission denied',
          message: 'Only admins can update auction status'
        });
        console.log(`Unauthorized status update attempt by ${user.role}: ${socket.id}`);
        return;
      }

      const { auctionId, status } = data;
      console.log(`Auction ${auctionId} status changed to: ${status} by ${user.name}`);
      
      // Broadcast status change to all clients
      io.to(`auction-${auctionId}`).emit('auction-status-changed', {
        auctionId,
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Handle auction end (admin only)
    socket.on('end-auction', (auctionId) => {
      const user = socket.data.user;
      
      // Check if user is admin
      if (user.role !== 'admin') {
        socket.emit('error', {
          error: 'Permission denied',
          message: 'Only admins can end auctions'
        });
        console.log(`Unauthorized auction end attempt by ${user.role}: ${socket.id}`);
        return;
      }

      console.log(`Auction ${auctionId} ended by ${user.name}`);
      
      io.to(`auction-${auctionId}`).emit('auction-ended', {
        auctionId,
        finalState: activeAuctions.get(auctionId),
        timestamp: new Date().toISOString()
      });
      
      activeAuctions.delete(auctionId);
    });

    socket.on('disconnect', () => {
      authenticatedUsers.delete(socket.id);
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('> WebSocket server running with JWT authentication');
    });
});
