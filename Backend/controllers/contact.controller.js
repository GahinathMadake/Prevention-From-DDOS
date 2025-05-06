const Contact = require('../models/Contact');

const submitContactForm = async (req, res) => {
  console.log("Request received for form submission!");

  const { name, email, message } = req.body;
  const userId = req.user?.id; // From auth middleware

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are necessary' });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count submissions by this user today
    const submissionCount = await Contact.countDocuments({
      userId,
      submittedAt: { $gte: today },
    });

    if (submissionCount >= 3) {
      return res.status(429).json({ message: 'Limit exceeded: 3 submissions per day' });
    }

    const newContact = new Contact({ name, email, message, userId });
    await newContact.save();

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitContactForm };
