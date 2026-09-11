export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          status: 'error',
          message: 'Erro de validação nos dados enviados',
          errors: formattedErrors
        });
      }

      return res.status(400).json({
        status: 'error',
        message: 'Dados inválidos fornecidos'
      });
    }
  };
};
