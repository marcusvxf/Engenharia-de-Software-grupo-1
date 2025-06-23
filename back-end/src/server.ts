import app from '.';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

export const handler = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
