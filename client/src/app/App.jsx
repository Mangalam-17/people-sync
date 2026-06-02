import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import Providers from '@/app/providers';

const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;
