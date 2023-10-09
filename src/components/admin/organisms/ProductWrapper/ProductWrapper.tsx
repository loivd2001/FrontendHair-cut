import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderTable from '../../atoms/HeaderTable/HeaderTable';
import { COL_PRODUCT } from '@/type/TableType/table_type';
import { DeleteForeverOutlined, EditOutlined } from '@mui/icons-material';
import './ProductWrapper.scss';
import DialogWrapper from '../../atoms/Dialog';
import InputUpload from '@/components/atoms/InputUpload/InputUpload';
import { FormikHelpers, FormikProvider, useFormik } from 'formik';
import { ParamProduct, ProductType } from '@/api_type/Product';
import { TEXT_FIELD_PRODUCT } from '@/constants/constant';
import { CategoryType } from '@/api_type/Category';
import SelectField from '@/components/atoms/SelectField';
import { validationProductSchema } from '@/validations/product_validation';
import { LoadingContext } from '@/context/LoadingContext';
import { AlertDialogContext } from '@/context/AlertDialogContext';
import API from '@/services/axiosClient';
import _ from 'lodash';

interface ProductWrapperProps {
  product: ProductType[];
  category: CategoryType[];
  getProduct: () => void;
}

//TODO
const ProductWrapper = ({
  product,
  category,
  getProduct,
}: ProductWrapperProps) => {
  const [dialog, setDialog] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const preloader = useContext(LoadingContext);
  const alertDialog = useContext(AlertDialogContext);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const formik = useFormik({
    initialValues: {
      productName: '',
      price: 0,
      categoryId: 0,
      image: '',
    },
    validationSchema: validationProductSchema,
    onSubmit: (values: ParamProduct, actions: FormikHelpers<ParamProduct>) =>
      HandleCreateProduct(values, actions),
  });

  const HandleCreateProduct = async (
    values: ParamProduct,
    actions: FormikHelpers<ParamProduct>,
  ) => {
    try {
      preloader.show();
      const formData = new FormData();
      formData.append('productName', values.productName);
      formData.append('price', values.price.toString());
      formData.append('categoryId', values.categoryId.toString());
      formData.append('image', values.image);
      await API.apiCreateProduct(formData);
      await getProduct();
      actions.resetForm({
        values: formik.initialValues,
      });
    } catch (error) {
      const message = _.get(error, 'message', JSON.stringify(error));
      alertDialog.show(message, false);
    } finally {
      setDialog(false);
      preloader.hidden();
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      formik.setFieldValue('image', file);
    }
  };

  const handleClose = () => {
    setSelectedImage('');
  };

  return (
    <div className="product-wrapper">
      <div className="product-wrapper__header mx-2">
        <h1 className="text_title">Manager Product</h1>
        <Button
          color="success"
          size="medium"
          variant="contained"
          onClick={() => setDialog(true)}
        >
          {t('product.create')}
        </Button>
      </div>
      <DialogWrapper
        maxWidth="sm"
        open={dialog}
        title="Create Product"
        onClose={() => setDialog(false)}
        onClickSave={formik.handleSubmit}
      >
        {TEXT_FIELD_PRODUCT.map((e) => {
          return (
            <TextField
              className="product-wrapper__input"
              type={e.type}
              value={formik.values[e.value] || ''}
              key={e.id}
              fullWidth
              id={e.value}
              label={e.label}
              variant="outlined"
              onChange={formik.handleChange}
              error={formik.touched[e.value] && Boolean(formik.errors[e.value])}
              helperText={formik.touched[e.value] && formik.errors[e.value]}
            />
          );
        })}

        <FormikProvider value={formik}>
          <SelectField label="Category" name="categoryId" options={category} />
        </FormikProvider>

        <InputUpload
          urlImage={formik.values['image'] ? selectedImage : ''}
          handleFileChange={handleFileChange}
          classes="mt-4"
          handleClose={handleClose}
        />
        {formik.touched.image && formik.errors.image && (
          <div style={{ color: 'red' }}>{formik.errors.image}</div>
        )}
      </DialogWrapper>

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 2,
          border: 'none',
          height:'100%',
        }}
      >
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader sx={{ m: 0 }}>
            <HeaderTable columns={COL_PRODUCT} />
            <TableBody>
              {product
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={product.id.toString()}
                    >
                      {COL_PRODUCT.map((column) => {
                        const value = product[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className="table"
                          >
                            {column.id === 'action' ? (
                              <div className="product-wrapper__action">
                                <div className="product-wrapper__action__edit">
                                  <EditOutlined />
                                </div>
                                <div className="product-wrapper__action__delete">
                                  <DeleteForeverOutlined />
                                </div>
                              </div>
                            ) : column.id === 'id' ? (
                              index + 1
                            ) : column.id === 'urlImg' ? (
                              <img
                                className="product-wrapper__action__image"
                                alt="anh dep"
                                src={product.urlImg}
                                height={100}
                                width={100}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={product.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ProductWrapper;
