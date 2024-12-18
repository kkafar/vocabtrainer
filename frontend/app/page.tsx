import CenterYXContainer from "./ui/layout/CenterYXContainer";
import FullScreenContainer from "./ui/layout/FullScreenContainer";
import MainTitle from '@/app/ui/MainTitle';

export default async function Home() {
  return (
    <FullScreenContainer>
      <CenterYXContainer>
        <MainTitle>
          VocabTrainer
        </MainTitle>
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
