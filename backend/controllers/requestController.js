const Request = require('../models/Request');
const User = require('../models/User');

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, skillRequested, skillOfferedInReturn } = req.body;

    if (!senderId) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    if (!receiverId || !skillRequested || !skillOfferedInReturn) {
      return res
        .status(400)
        .json({ message: 'receiverId, skillRequested, and skillOfferedInReturn are required.' });
    }

    if (receiverId === senderId) {
      return res.status(400).json({ message: 'You cannot send a request to yourself.' });
    }

    const receiverExists = await User.findById(receiverId).select('_id');
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    const request = await Request.create({
      senderId,
      receiverId,
      skillRequested,
      skillOfferedInReturn
    });

    const populated = await request.populate('receiverId', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('sendRequest error:', error);
    res.status(500).json({ message: 'Server error while sending request.' });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const requests = await Request.find({ receiverId: userId })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('getIncomingRequests error:', error);
    res.status(500).json({ message: 'Server error while fetching requests.' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined.' });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    if (request.receiverId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update requests sent to you.' });
    }

    request.status = status;
    await request.save();

    const populated = await request.populate('senderId', 'name email');

    res.json(populated);
  } catch (error) {
    console.error('updateRequestStatus error:', error);
    res.status(500).json({ message: 'Server error while updating request.' });
  }
};

exports.getAcceptedBarters = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const barters = await Request.find({
      status: 'accepted',
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ updatedAt: -1 });

    res.json(barters);
  } catch (error) {
    console.error('getAcceptedBarters error:', error);
    res.status(500).json({ message: 'Server error while fetching accepted barters.' });
  }
};
