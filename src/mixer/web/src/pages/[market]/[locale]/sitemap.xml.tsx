import { getSiteMapXMLProps } from '@websolutespa/bom-mixer-models';
import { GetServerSideProps } from 'next';

export default function SiteMapXml() {
  // getSiteMapXMLProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = getSiteMapXMLProps;
