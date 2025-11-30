// asyncWrapper: a higher-order function that takes an async function as a parameter,
// returns a new function that automatically handles (req, res, next),
// executes the passed async function with these parameters,
// and catches any errors to pass them to the next middleware.


module.exports = (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((err) => next(err));
  };
};