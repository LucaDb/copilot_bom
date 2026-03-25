import { imageHandler } from '@websolutespa/bom-mixer-image';

const IMAGE_DOMAINS = process.env.IMAGE_DOMAINS ? process.env.IMAGE_DOMAINS.split(',') : [];
const IMAGE_SIZES = process.env.IMAGE_SIZES ? process.env.IMAGE_SIZES.split(',').map(x => parseInt(x)) : [750, 960, 1440, 1600, 1920];
const IMAGE_QUALITY = process.env.IMAGE_QUALITY ? parseInt(process.env.IMAGE_QUALITY) : 90;

export default imageHandler({
  domains: IMAGE_DOMAINS,
  sizes: IMAGE_SIZES,
  quality: IMAGE_QUALITY,
});
