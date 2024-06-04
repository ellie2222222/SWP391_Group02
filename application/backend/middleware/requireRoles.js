const requireUser = (req, res, next) => {
  if (req.role !== 'user') {
    return res.status(403).json({ error: 'Must have role user' });
  }

  next();
}

const requireAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
  
    next();
  }

const requireManager = (req, res, next) => {
    if (req.role !== 'manager') {
      return res.status(403).json({ error: 'Manager access required' });
    }
  
    next();
  }

const requireSales = (req, res, next) => {
    if (req.role !== 'sale_staff') {
      return res.status(403).json({ error: 'Sale Staff access required' });
    }
  
    next();
  }

const requireDesigns = (req, res, next) => {
    if (req.role !== 'design_staff') {
      return res.status(403).json({ error: 'Design Staff access required' });
    }
  
    next();
  }

const requireProductions = (req, res, next) => {
  if (req.role !== 'production_staff') {
    return res.status(403).json({ error: 'Production Staff access required' });
  }

  next();
}

const requireManagerOrSale = (req, res, next) => {
  if (req.role !== 'sale_staff' && req.role !== 'manager') {
    return res.status(403).json({ error: 'Sale Staff or Manager access required' });
  }

  next();
}

const requireManagerOrStaff = (req, res, next) => {
  if (req.role !== 'sale_staff' && req.role !== 'design_staff' && req.role !== 'production_staff' && req.role !== 'manager') {
    return res.status(403).json({ error: 'Staff or Manager access required' });
  }

  next();
}

module.exports = {requireAdmin, requireManager, requireSales, requireDesigns, requireProductions, requireManagerOrSale, requireUser, requireManagerOrStaff };