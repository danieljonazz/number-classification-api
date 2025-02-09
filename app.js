const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4000;

// Force JSON responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "application/json"); // Explicitly set JSON
  next();
});

// Helper functions
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const isPerfect = (n) => {
  if (n < 2) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum === n;
};

const isArmstrong = (n) => {
  const digits = String(n).split("");
  const length = digits.length;
  const sum = digits.reduce(
    (acc, digit) => acc + Math.pow(Number(digit), length),
    0
  );
  return sum === n;
};

const digitSum = (n) => {
  return String(n)
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);
};

const getFunFact = async (n) => {
  try {
    const response = await axios.get(`http://numbersapi.com/${n}/math?json`);
    return response.data.text || null; // Ensure valid JSON return
  } catch (error) {
    return null; // Avoid non-JSON errors
  }
};

// API endpoint
app.get("/api/classify-number", async (req, res) => {
  const number = req.query.number;

  if (!number || isNaN(number)) {
    return res.status(400).json({ number: number, error: true });
  }

  const num = Math.trunc(parseFloat(number));
  const properties = [];
  if (isArmstrong(num)) properties.push("armstrong");
  if (num % 2 === 0) properties.push("even");
  else properties.push("odd");

  const funFact = await getFunFact(num);

  const response = {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties: properties,
    digit_sum: digitSum(num),
    fun_fact: funFact, // Now safely JSON
  };

  res.status(200).json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
