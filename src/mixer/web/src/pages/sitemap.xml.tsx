// import { getSiteMapXMLProps } from '@websolutespa/bom-mixer-models';
import { getSiteMapIndexProps } from '@websolutespa/bom-mixer-models';
import { GetServerSideProps } from 'next';

export default function SiteMapXml() {
  // getSiteMapXMLProps will do the heavy lifting
}

// export const getServerSideProps: GetServerSideProps = getSiteMapXMLProps;
export const getServerSideProps: GetServerSideProps = getSiteMapIndexProps;
