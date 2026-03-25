import { Layout, Meta } from '@websolutespa/bom-mixer-ui';
import { Footer, Header } from '../../sections';

export type LayoutDefaultProps = {
  children?: React.ReactNode;
};

export function LayoutDefault({ children }: LayoutDefaultProps) {
  return (
    <>
      <Meta />
      <Layout>
        <Header sticky />
        {children}
        <Footer />
      </Layout>
    </>
  );
}
