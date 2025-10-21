import Header from '@/routes/-components/Header';
import RoundedCard from '@/ui/components/card/RoundedCard';
import CenteredLayout from '@/ui/components/layout/CenteredLayout';
import FillParentLayout from '@/ui/components/layout/FillParentLayout';
import ViewportContainer from '@/ui/components/layout/ViewportContainer';
import VStack from '@/ui/components/layout/VStack';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vocab/explore/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ViewportContainer>
      <VStack className='w-[100%]'>
        <Header />
        <Content />
      </VStack>
    </ViewportContainer>
  );
}

function Content() {
  return (
    <FillParentLayout>
      <div className='flex flex-1'>
        <div className='flex flex-col flex-1 p-8 pr-4'>
          <FillParentLayout className='bg-navydark-140 rounded-xl'>
          </FillParentLayout>
        </div>
      </div>
      <div className='flex flex-2'>
        <CenteredLayout>
          <RoundedCard className='bg-greendark-60'>
            <CenteredLayout>
              <div>
                Content
              </div>
            </CenteredLayout>
          </RoundedCard>
        </CenteredLayout>
      </div>
      <div className='flex flex-col flex-1 p-8 pl-4'>
        <FillParentLayout className='bg-navydark-140 rounded-xl'>
        </FillParentLayout>
      </div>
    </FillParentLayout>
  );
}

