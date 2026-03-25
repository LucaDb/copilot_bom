import { IconWebsolute } from '@copilot_bom/icons';
import { Button, Container, Flex, Link, Text, UIComponentProps, getCssResponsive } from '@websolutespa/bom-mixer-ui';
import styled from 'styled-components';

export type FooterProps = UIComponentProps<{
}>;

const FooterContainer = styled.footer<FooterProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 200px;
  padding: 2rem 0;
  ${props => getCssResponsive(props)}
`;

export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  function getYear() {
    return new Date().getFullYear();
  }
  return (
    <FooterContainer {...props}>
      <Container.Fluid>
        <Flex.Row
          as="nav" role="navigation" aria-label="Footer"
          justifyContent="space-between"
        >
          <Text variant="paragraph30" color="var(--color-neutral-500)">©{getYear()} websolute spa</Text>
          <Link href="https://www.websolute.com">
            <Button as="a" target="_blank" title="Digital Marketing"><IconWebsolute /></Button>
          </Link>
        </Flex.Row>
      </Container.Fluid>
    </FooterContainer>
  );
};
