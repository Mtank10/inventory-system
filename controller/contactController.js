import Contact from '../model/Contact.js';



export const getContact = (async (req,res)=>{
  try {
    const { type, q } = req.query;
    let filter = { businessId: req.user.businessId };
    
    if (type) {
      filter.type = type;
    }
    
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    
    const contacts = await Contact.find(filter);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const createContact =  (async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      businessId: req.user.businessId
    });
    
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export const updateContact =( async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      req.body,
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const deleteContact =(async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

