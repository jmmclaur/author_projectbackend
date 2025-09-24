//route new users to / root route
exports.main = (req, res) => {
  res.send(
    "Welcome to the World of Majera! Explore characters and stories by signing up or logging in."
  );
};
