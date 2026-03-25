import { IOption, getClassNames } from '@websolutespa/bom-core';
import { RequiredIfValidator, RequiredTrueValidator, RequiredValidator, useFormSchema } from '@websolutespa/bom-mixer-forms';
import { useApi, useLabel } from '@websolutespa/bom-mixer-hooks';
import { ILazyableProps } from '@websolutespa/bom-mixer-models';
import { Button, Container, FieldCollection, Flex, Form, FormTester, Grid, Section } from '@websolutespa/bom-mixer-ui';
import { useEffect, useState } from 'react';

export type TestFormItem = {
};

export type ITestForm = {
  firstName: string;
  category: IOption;
  brand: IOption;
  privacy: boolean;
};

export type TestFormProps = {
  onSubmit?: (value: ITestForm) => void
};

const categoryOptions: IOption[] = [
  { id: '1', name: 'Category A' },
  { id: '2', name: 'Category B' },
];

const brandOptions: IOption[] = [
  { id: '1', name: 'Brand A' },
  { id: '2', name: 'Brand B' },
];

const modelOptions: IOption[] = [
  { id: '1', name: 'Model A' },
  { id: '2', name: 'Model B' },
];

export function TestForm({ item, onSubmit }: ILazyableProps<TestFormItem> & TestFormProps) {

  const label = useLabel();
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const required = RequiredValidator();
  const requiredTrue = RequiredTrueValidator();

  const requiredIfCategoryA = RequiredIfValidator((value, rootValue) => rootValue?.category?.id === '1');
  const hiddenIfNotCategoryA = (value: any, rootValue: any) => !(rootValue?.category?.id === '1');

  const { form } = useFormSchema<ITestForm>({
    firstName: {
      schema: 'text', label: 'Nome', placeholder: 'il tuo nome', validators: required,
    },
    category: {
      schema: 'select', label: 'Categoria', placeholder: 'seleziona una categoria', options: categoryOptions, validators: [],
    },
    brand: {
      schema: 'select', label: 'Brand', placeholder: 'seleziona un brand', options: brandOptions, validators: [],
    },
    model: {
      schema: 'select', label: 'Model', placeholder: 'seleziona un brand', options: modelOptions, validators: [requiredIfCategoryA], hidden: hiddenIfNotCategoryA,
    },
  });

  useEffect(() => {
    const onChange = (value: ITestForm) => {
      console.log('TestForm.form.change', value);
      if (value.category?.id === '1') {
        form.controls.brand.options = [brandOptions[0]];
      } else if (value.category?.id === '2') {
        form.controls.brand.options = brandOptions;
      }
    };
    form.on('change', onChange);
    return () => form.off('change', onChange);
  }, [form]);

  const onReset = () => {
    // console.log('TestForm.onReset');
    form.reset();
  };

  const onValidate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.valid) {
      console.log('TestForm.onSubmit.valid', form.value);
      const value = form.value!;
      setBusy(true);
      try {
        if (typeof onSubmit === 'function') {
          onSubmit(value);
        }
      } catch (error: any) {
        console.log('TestForm.error', error);
        setError(error);
      } finally {
        setBusy(false);
      }
    } else {
      console.log('TestForm.onSubmit.invalid');
      form.touched = true;
    }
  };

  const classNames = getClassNames('contact-form');

  return (
    <Section className={classNames} id={item.anchor?.hash} padding="3rem 0" margin="4rem 0">
      <Container maxWidthMd="80ch">
        <Form variant="minimal" onSubmit={onValidate}>
          <Grid.Row columnGap="1.5rem" columnGapMd="3rem" rowGap="1.5rem" rowGapMd="3rem">
            <FieldCollection collection={form} />
            <Grid>
              <Flex.Row justifyContent="space-between">
                <Button variant="primary" type="submit" disabled={busy}>{label('form.submit')}</Button>
                <Button variant="underline" onClick={onReset} disabled={busy}>{label('form.reset')}</Button>
              </Flex.Row>
            </Grid>
            <Grid>
              <FormTester form={form} test={{
                category: categoryOptions[0],
                brand: brandOptions[0],
              }}></FormTester>
            </Grid>
          </Grid.Row>
        </Form>
      </Container>
    </Section>
  );
}
