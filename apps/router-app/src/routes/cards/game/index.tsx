import HeaderLogo from '@/ui/components/HeaderLogo';
import HeaderLayout from '@/ui/components/layout/HeaderLayout';
import ViewportContainer from '@/ui/components/layout/ViewportContainer';
import VStack from '@/ui/components/layout/VStack';
import { createFileRoute } from '@tanstack/react-router'
import CardGame from './-components/CardGame';

export const Route = createFileRoute('/cards/game/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ViewportContainer>
      <VStack className='w-[100%]'>
        <HeaderLayout className='bg-greendark-80'>
          <HeaderLogo />
        </HeaderLayout>
        <CardGame />
      </VStack>
    </ViewportContainer>
  );
}

