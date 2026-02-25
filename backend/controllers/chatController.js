const Message = require('../models/Message');

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { receiverId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required.' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (error) {
    console.error('getChatHistory error:', error);
    res.status(500).json({ message: 'Server error while fetching chat history.' });
  }
};

