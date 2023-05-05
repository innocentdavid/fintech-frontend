

export default function handler(req, res) {
    if (req.method === 'POST') {
      // Handle login request
      const { email, password } = req.body;
  
      // Check if email and password are valid
      if (email === 'user@example.com' && password === 'password123') {
        // Generate a JWT token for the user
        const token = generateToken(email);
  
        // Return the token to the client
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  
  function generateToken(email) {
    // Generate a JWT token using a library like jsonwebtoken
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    return token;
  }
  