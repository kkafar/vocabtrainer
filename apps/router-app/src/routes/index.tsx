import { createFileRoute } from '@tanstack/react-router'
import '../App.css'
import CenteredLayout from '@/ui/components/layout/CenteredLayout'
import ViewportContainer from '@/ui/components/layout/ViewportContainer'
import VStack from '@/ui/components/layout/VStack'
import Menu from './-components/Menu'
import Logo from './-components/Logo'
import HSpacer from '@/ui/components/layout/HSpacer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <ViewportContainer>
        <CenteredLayout>
          <VStack>
            <Logo />
            <HSpacer className='h-16' />
            <Menu />
          </VStack>
        </CenteredLayout>
      </ViewportContainer>
    </div>
  )
}
