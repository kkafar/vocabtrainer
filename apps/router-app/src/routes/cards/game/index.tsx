import ViewportContainer from '@/ui/components/layout/ViewportContainer';
import VStack from '@/ui/components/layout/VStack';
import { createFileRoute } from '@tanstack/react-router'
import CardGame from './-components/CardGame';
import Header from './-components/Header';

export const Route = createFileRoute('/cards/game/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ViewportContainer>
      <VStack className='w-[100%]'>
        <Header />
        <CardGame />
      </VStack>
    </ViewportContainer>
  );
}

