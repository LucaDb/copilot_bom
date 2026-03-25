import { getSiteMapXSLProps } from '@websolutespa/bom-mixer-models';
import { GetServerSideProps } from 'next';

export default function SiteMapXsl() {
  // getSiteMapXSLProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = getSiteMapXSLProps;
