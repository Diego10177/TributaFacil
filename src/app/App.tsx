import { DemoExperience } from './components/DemoExperience';

// Original reference screens use this type; they are outside the classroom flow.
export type View = 'landing' | 'deuda' | 'payment' | 'notifications' | 'admin-dashboard' | 'admin-contribuyentes';

export default function App() {
  return <DemoExperience />;
}
