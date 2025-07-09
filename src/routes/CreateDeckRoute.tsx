import { useNavigate } from 'react-router-dom';
import { CreateDeckPage } from '../components/CreateDeckPage';

interface CreateDeckRouteProps {
  onCreateDeck: (name: string, description: string, color: string) => void;
}

export function CreateDeckRoute({ onCreateDeck }: CreateDeckRouteProps) {
  const navigate = useNavigate();

  const handleCreateDeck = (name: string, description: string, color: string) => {
    onCreateDeck(name, description, color);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <CreateDeckPage
      onCreateDeck={handleCreateDeck}
      onCancel={handleCancel}
    />
  );
}
