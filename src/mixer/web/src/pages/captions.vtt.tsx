import { getCaptionsVttProps } from '@websolutespa/bom-mixer-models';
import { GetServerSideProps } from 'next';

export default function CaptionsVtt() {
  // getCaptionsVttProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = getCaptionsVttProps;
