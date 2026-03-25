import { ILazyModules, ILazyProps } from '@websolutespa/bom-mixer-models';
import dynamic from 'next/dynamic';
import { ContactFormItem } from './contact-form/contact-form';
import { ImageLoopTestItem } from './image-loop-test/image-loop-test';
import { SvgTestItem } from './svg-test/svg-test';
import { TestFormItem } from './test-form/test-form';
import { TestPaginationInfiniteItem } from './test-pagination-infinite/test-pagination-infinite';
import { TestPaginationItem } from './test-pagination/test-pagination';
import { TextDescriptionItem } from './text-description/text-description';
import { VideoTestItem } from './video-test/video-test';

export const LAZY_MODULES: ILazyModules = {
  'contact_form': dynamic<ILazyProps<ContactFormItem>>(() => import('./contact-form/contact-form').then(
    module => module.ContactForm
  )),
  'image_loop_test': dynamic<ILazyProps<ImageLoopTestItem>>(() => import('./image-loop-test/image-loop-test').then(
    module => module.ImageLoopTest
  )),
  'svg_test': dynamic<ILazyProps<SvgTestItem>>(() => import('./svg-test/svg-test').then(
    module => module.SvgTest
  )),
  'test_form': dynamic<ILazyProps<TestFormItem>>(() => import('./test-form/test-form').then(
    module => module.TestForm
  )),
  'test_pagination': dynamic<ILazyProps<TestPaginationItem>>(() => import('./test-pagination/test-pagination').then(
    module => module.TestPagination
  )),
  'test_pagination_infinite': dynamic<ILazyProps<TestPaginationInfiniteItem>>(() => import('./test-pagination-infinite/test-pagination-infinite').then(
    module => module.TestPaginationInfinite
  )),
  'text_description': dynamic<ILazyProps<TextDescriptionItem>>(() => import('./text-description/text-description').then(
    module => module.TextDescription
  )),
  'video_test': dynamic<ILazyProps<VideoTestItem>>(() => import('./video-test/video-test').then(
    module => module.VideoTest
  )),
};
