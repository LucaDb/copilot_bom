import { IOption, getClassNames } from '@websolutespa/bom-core';
import { EmailValidator, RequiredTrueValidator, RequiredValidator, useFormSchema } from '@websolutespa/bom-mixer-forms';
import { useApi, useLabel } from '@websolutespa/bom-mixer-hooks';
import { ILazyableProps } from '@websolutespa/bom-mixer-models';
import { Button, Container, FieldCollection, Flex, Form, FormTester, Grid, Section, Text } from '@websolutespa/bom-mixer-ui';
import { useState } from 'react';

export type ContactFormItem = {
};

export type IContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  country: IOption;
  privacy: boolean;
};

export type ContactFormProps = {
  onSubmit?: (value: IContactForm) => void
};

const countryOptions: IOption[] = [
  { id: '1', name: 'Italia' },
  { id: '2', name: 'Francia' },
  { id: '3', name: 'Germania' },
];

export function ContactForm({ item, onSubmit }: ILazyableProps<ContactFormItem> & ContactFormProps) {

  const label = useLabel();
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const required = RequiredValidator();
  const requiredTrue = RequiredTrueValidator();
  const email = EmailValidator();

  const { form } = useFormSchema<IContactForm>({
    firstName: {
      schema: 'text', label: 'Name', placeholder: 'type your name', validators: required,
    },
    lastName: {
      schema: 'text', label: 'Surname', placeholder: 'type your surname', validators: required,
    },
    email: {
      schema: 'email', label: 'Email', placeholder: 'type your email', validators: [required, email],
    },
    country: {
      schema: 'select', label: 'Country', placeholder: 'select a country', options: countryOptions, validators: required,
      // schema: 'select', label: 'Country', placeholder: 'select a country', options: countryOptions, validators: required, value: countryOptions[0],
    },
    privacy: {
      schema: 'checkbox', label: 'Privacy', validators: requiredTrue,
    },
  });

  const onReset = () => {
    // console.log('ContactForm.onReset');
    form.reset();
  };

  const onValidate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.valid) {
      // console.log('ContactForm.onSubmit.valid', form.value);
      const value = form.value!;
      setBusy(true);
      try {
        if (typeof onSubmit === 'function') {
          onSubmit(value);
        }
      } catch (error: any) {
        console.log('ContactForm.error', error);
        setError(error);
      } finally {
        setBusy(false);
      }
    } else {
      console.log('ContactForm.onSubmit.invalid');
      form.touched = true;
    }
  };

  const classNames = getClassNames('contact-form');

  return (
    <Section className={classNames} id={item.anchor?.hash} padding="3rem 0" margin="4rem 0">
      <Container maxWidthMd="80ch">
        <Form variant="minimal" onSubmit={onValidate}>
          <Grid.Row columnGap="1.5rem" columnGapMd="3rem" rowGap="1.5rem" rowGapMd="3rem">
            <Grid>
              <Text>All the fields marked with an asterisk (*) are required</Text>
            </Grid>
            <FieldCollection collection={form} />
            <Grid>
              <Flex.Row justifyContent="space-between">
                <Button variant="primary" type="submit" disabled={busy}>{label('form.submit')}</Button>
                <Button variant="underline" onClick={onReset} disabled={busy}>{label('form.reset')}</Button>
              </Flex.Row>
            </Grid>
            <Grid>
              <FormTester form={form} test={{
                firstName: 'John',
                lastName: 'Appleseed',
                email: 'john@appleseed.com',
                country: countryOptions[0],
                privacy: true,
              }}></FormTester>
            </Grid>
          </Grid.Row>
        </Form>
      </Container>
    </Section>
  );
}
