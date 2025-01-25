export const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
};
