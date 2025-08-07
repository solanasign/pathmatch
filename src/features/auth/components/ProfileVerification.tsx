import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Image,
  Select,
  FormErrorMessage,
  Alert,
  AlertIcon,
  ContainerProps,
} from '@chakra-ui/react';

// Exported types/interfaces for use in other components
export interface VerificationFormData {
  bio?: string;
  contentCategories?: string[];
  idDocument?: File | null;
  selfieWithId?: File | null;
  [key: string]: any;
}

export interface VerificationFieldConfig {
  name: keyof VerificationFormData | string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'custom';
  required?: boolean;
  options?: string[];
  accept?: string;
  multiple?: boolean;
  render?: (props: any) => React.ReactNode;
  placeholder?: string;
  hide?: boolean;
}

export interface ProfileVerificationProps extends Omit<ContainerProps, 'onSubmit'> {
  initialData?: VerificationFormData;
  onSubmit?: (data: VerificationFormData) => Promise<void> | void;
  fields?: VerificationFieldConfig[];
  validation?: (data: VerificationFormData) => string | null;
  submitButtonText?: string;
  successMessage?: string;
  mode?: string;
  heading?: string;
  description?: string;
  showAlert?: boolean;
  alertMessage?: string;
}

const defaultFields: VerificationFieldConfig[] = [
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    required: true,
    placeholder: 'Tell us about yourself and your content...',
  },
  {
    name: 'contentCategories',
    label: 'Content Categories',
    type: 'select',
    required: true,
    options: [
      'Photography',
      'Videography',
      'Art',
      'Music',
      'Writing',
      'Fitness',
      'Fashion',
      'Lifestyle',
      'Other',
    ],
    multiple: true,
  },
  {
    name: 'idDocument',
    label: 'ID Document',
    type: 'file',
    required: true,
    accept: 'image/*,.pdf',
  },
  {
    name: 'selfieWithId',
    label: 'Selfie with ID',
    type: 'file',
    required: true,
    accept: 'image/*',
  },
];

const ProfileVerification: React.FC<ProfileVerificationProps> = ({
  initialData = {},
  onSubmit,
  fields = defaultFields,
  validation,
  submitButtonText = 'Submit Verification',
  successMessage = 'Your profile is being reviewed. We will notify you once verified.',
  mode,
  heading = 'Profile Verification',
  description = 'To become a verified creator, please provide the following information and documents. This helps us ensure the safety and authenticity of our platform.',
  showAlert = false,
  alertMessage = '',
  ...containerProps
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<VerificationFormData>({
    bio: '',
    contentCategories: [],
    idDocument: null,
    selfieWithId: null,
    ...initialData,
  });
  const [previewUrls, setPreviewUrls] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const select = e.target as HTMLSelectElement;
      const categories = Array.from(select.selectedOptions, (option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: categories }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPG, PNG, or PDF file',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls((prev) => ({ ...prev, [name]: previewUrl }));
      }
    }
  };

  const defaultValidation = (data: VerificationFormData) => {
    for (const field of fields) {
      if (field.required && !data[field.name]) {
        return `${field.label} is required`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const errorMsg = validation ? validation(formData) : defaultValidation(formData);
    if (errorMsg) {
      toast({
        title: 'Validation Error',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default: POST to /api/auth/verify-profile
        const formDataToSend = new FormData();
        for (const field of fields) {
          const value = formData[field.name as string];
          if (field.type === 'file' && value) {
            formDataToSend.append(field.name as string, value);
          } else if (field.type === 'select' && Array.isArray(value)) {
            formDataToSend.append(field.name as string, JSON.stringify(value));
          } else if (typeof value === 'string') {
            formDataToSend.append(field.name as string, value);
          }
        }
        await fetch('/api/auth/verify-profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        });
      }
      toast({
        title: 'Profile verification submitted',
        description: successMessage,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error submitting verification',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8} {...containerProps}>
      <VStack spacing={8} align="stretch">
        {heading && <Heading size="lg">{heading}</Heading>}
        {description && <Text>{description}</Text>}
        {showAlert && alertMessage && (
          <Alert status="info">
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {fields.filter(f => !f.hide).map((field) => {
              if (field.render) {
                return <React.Fragment key={field.name}>{field.render({ formData, setFormData, isLoading })}</React.Fragment>;
              }
              switch (field.type) {
                case 'textarea':
                  return (
                    <FormControl key={field.name} isRequired={field.required}>
                      <FormLabel>{field.label}</FormLabel>
                      <Textarea
                        name={field.name as string}
                        value={formData[field.name as string] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        minH="150px"
                        disabled={isLoading}
                      />
                    </FormControl>
                  );
                case 'select':
                  return (
                    <FormControl key={field.name} isRequired={field.required}>
                      <FormLabel>{field.label}</FormLabel>
                      <Select
                        name={field.name as string}
                        multiple={field.multiple}
                        value={formData[field.name as string] || []}
                        onChange={handleInputChange}
                        size="md"
                        disabled={isLoading}
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        Please select at least one {field.label.toLowerCase()}
                      </FormErrorMessage>
                    </FormControl>
                  );
                case 'file':
                  return (
                    <FormControl key={field.name} isRequired={field.required}>
                      <FormLabel>{field.label}</FormLabel>
                      <Input
                        type="file"
                        name={field.name as string}
                        accept={field.accept}
                        onChange={handleFileChange}
                        p={1}
                        disabled={isLoading}
                      />
                      {previewUrls[field.name] && (
                        <Box mt={2}>
                          <Image
                            src={previewUrls[field.name]}
                            alt={`${field.label} Preview`}
                            maxH="200px"
                            objectFit="contain"
                          />
                        </Box>
                      )}
                    </FormControl>
                  );
                default:
                  return (
                    <FormControl key={field.name} isRequired={field.required}>
                      <FormLabel>{field.label}</FormLabel>
                      <Input
                        type={field.type}
                        name={field.name as string}
                        value={formData[field.name as string] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        disabled={isLoading}
                      />
                    </FormControl>
                  );
              }
            })}
            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              isLoading={isLoading}
              loadingText="Submitting..."
            >
              {submitButtonText}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default ProfileVerification;