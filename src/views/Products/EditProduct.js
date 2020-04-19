import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";

import FlashStorage from "services/FlashStorage";
import ApiProductService from "services/api/ApiProductService";
import CategoryTree from "views/Categories/CategoryTree";
import { treefyAttributeData } from "helper/index";
const useStyles = makeStyles(() => ({
  textarea: {
    width: "100%"
  },
  select: {
    width: "100%",
    marginTop: 27
  },
  heading: {
    marginBottom: "0.5rem",
    size: "1.5rem",
    fontWeight: 600
  },
  table: {
    minWidth: 750
  },
  editingCell: {
    padding: "0 5px"
  },
  formControl: {
    display: "block"
  },
  formControlLabel: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontWeight: 600
  },
  formGroup: {
    border: "1px solid #eee",
    borderRadius: 5,
    padding: 5
  }
}));

const defaultProductModelState = {
  _id: "new",
  name: "",
  nameEN: "",
  description: "",
  descriptionEN: "",
  price: 0,
  cost: 0,
  categoryId: "",
  stock: {
    enabled: false,
    quantity: 0,
    outofstockMessage: "",
    outofstockMessageEN: ""
  },
  attributes: []
};

const defaultAttributeValueModelState = {
  attrIdx: -1,
  valIdx: -1,
  price: 0,
  cost: 0,
  quantity: 0
};

const defaultAttributesState = [];

const EditProductSkeleton = () => (
  <React.Fragment>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={240} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={240} />
    </GridItem>
  </React.Fragment>
);

const EditAttributeValueRow = ({ row, onSave, onCancel, ...extraProps }) => {
  const [model, setModel] = useState(row || defaultAttributeValueModelState);
  const classes = useStyles();
  return (
    <TableRow {...extraProps}>
      <TableCell>{model.attrName + " : " + model.valName}</TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.price,
            onChange: e => setModel({ ...model, price: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.cost,
            onChange: e => setModel({ ...model, cost: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.quantity,
            onChange: e => setModel({ ...model, quantity: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onSave(model, row)}>
          <SaveIcon />
        </IconButton>
        <IconButton onClick={() => onCancel(model, row)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const AttributeTable = ({ attributes, processing, onSave, onDelete }) => {
  const { t } = useTranslation();
  const [editRow, setEditRow] = useState({
    attrIdx: -1,
    valIdx: -1
  });
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("Combinations")}</TableCell>
            <TableCell>{t("Price")}</TableCell>
            <TableCell>{t("Cost")}</TableCell>
            <TableCell>{t("Quantity")}</TableCell>
            <TableCell>{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!attributes || !attributes.length) && (
            <TableRow>
              <TableCell align="center" colSpan={5}>
                {t("No data to display")}
              </TableCell>
            </TableRow>
          )}
          {attributes &&
            attributes.length > 0 &&
            attributes.map((attribute, attrIdx) =>
              attribute.values.map((value, valIdx) =>
                editRow.attrIdx === attrIdx && editRow.valIdx === valIdx ? (
                  <EditAttributeValueRow
                    key={attrIdx + "_" + valIdx}
                    row={{
                      attrName: attribute.name,
                      valName: value.name,
                      price: parseFloat(value.price),
                      cost: parseFloat(value.cost),
                      quantity: parseInt(value.quantity)
                    }}
                    onSave={model => {
                      onSave(attrIdx, valIdx, model);
                      setEditRow({ attrIdx: -1, valIdx: -1 });
                    }}
                    onCancel={() => setEditRow({ attrIdx: -1, valIdx: -1 })}
                  />
                ) : (
                  <TableRow key={attrIdx + "_" + valIdx}>
                    <TableCell>{attribute.name + " : " + value.name}</TableCell>
                    <TableCell>{value.price}</TableCell>
                    <TableCell>{value.cost}</TableCell>
                    <TableCell>{value.quantity}</TableCell>
                    <TableCell>
                      <IconButton
                        disabled={processing}
                        onClick={() => setEditRow({ attrIdx, valIdx })}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        disabled={processing}
                        onClick={() => onDelete(attrIdx, valIdx)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AttributeGenerator = ({ attributes, onGenerate }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [model, setModel] = useState([]);
  const getChecked = (attrIdx, valIdx) => {
    for (let i = 0; i < model.length; i++) {
      if (model[i].attrIdx === attrIdx && model[i].valIdx === valIdx) {
        return true;
      }
    }
    return false;
  };
  const handleChange = (attrIdx, valIdx) => {
    const newModel = [...model];
    const modelIndex = newModel.findIndex(
      m => m.attrIdx === attrIdx && m.valIdx === valIdx
    );
    if (modelIndex > -1) {
      newModel.splice(modelIndex, 1);
    } else {
      newModel.push({ attrIdx, valIdx });
    }
    setModel(newModel);
  };

  return (
    <div>
      {attributes.map((attribute, attrIdx) => (
        <FormControl
          component="div"
          key={attrIdx}
          className={classes.formControl}
        >
          <FormLabel component="legend" className={classes.formControlLabel}>
            {attribute.name}
          </FormLabel>
          <FormGroup className={classes.formGroup}>
            {attribute.values.map((value, valIdx) => (
              <FormControlLabel
                key={attrIdx + "_" + valIdx}
                control={
                  <Checkbox
                    checked={getChecked(attrIdx, valIdx)}
                    onChange={() => handleChange(attrIdx, valIdx)}
                  />
                }
                label={value.name}
              />
            ))}
          </FormGroup>
        </FormControl>
      ))}
      <Box p={2} align="center">
        <Button
          variant="contained"
          color="secondary"
          disabled={!model.length}
          onClick={() => {
            onGenerate(treefyAttributeData(model));
          }}
        >
          {t("Generate")}
        </Button>
      </Box>
    </div>
  );
};

const EditProduct = ({ match, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(defaultProductModelState);
  const [categoryTreeData, setCategoryTreeData] = useState([]);
  const [attributes, setAttributes] = useState(defaultAttributesState);
  const [alert, setAlert] = useState(
    FlashStorage.get("PRODUCT_ALERT") || { message: "", severity: "info" }
  );

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const updatePage = () => {
    ApiProductService.getProduct(match.params.id)
      .then(({ data }) => {
        if (data.success) {
          setModel({ ...model, ...data.data });
          setCategoryTreeData(data.meta.categoryTree);
          setAttributes(data.meta.attributes);
        } else {
          setAlert({
            message: t("Data not found"),
            severity: "error"
          });
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Data not found"),
          severity: "error"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveModel = () => {
    removeAlert();
    setProcessing(true);
    ApiProductService.saveProduct(model)
      .then(({ data }) => {
        if (data.success) {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("PRODUCT_ALERT", newAlert);
            history.push("../products");
            return;
          } else {
            setAlert(newAlert);
            updatePage();
          }
        } else {
          setAlert({
            message: t("Save failed"),
            severity: "error"
          });
        }
        setProcessing(false);
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
        setProcessing(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    updatePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} lg={8}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Product")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Product") + ": " + model.name
                  : t("Add Product")}
              </h4>
            )}
          </CardHeader>
          <CardBody>
            <GridContainer>
              {!!alert.message && (
                <GridItem xs={12}>
                  <Alert severity={alert.severity} onClose={removeAlert}>
                    {alert.message}
                  </Alert>
                </GridItem>
              )}
              {loading && <EditProductSkeleton />}
              {!loading && (
                <React.Fragment>
                  <GridItem xs={12}>
                    <GridContainer>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>
                          {t("Basic Information")}
                        </h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Product Name (Chinese)")}
                            id="product-name"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.name,
                              onChange: e => {
                                setModel({ ...model, name: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Product Name (English)")}
                            id="product-name-english"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.nameEN,
                              onChange: e => {
                                setModel({ ...model, nameEN: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-description"
                            label={t("Description (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                description: e.target.value
                              });
                            }}
                            variant="outlined"
                            value={model.description}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-description-english"
                            label={t("Description (English)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                descriptionEN: e.target.value
                              });
                            }}
                            variant="outlined"
                            value={model.descriptionEN}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Price")}
                            id="product-price"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.price,
                              onChange: e => {
                                setModel({ ...model, price: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Cost")}
                            id="product-cost"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.cost,
                              onChange: e => {
                                setModel({ ...model, cost: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>{t("Stock")}</h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <FormControl className={classes.select}>
                            <InputLabel id="product-stock-enabled-label">
                              {t("Enabled")}
                            </InputLabel>
                            <Select
                              labelId="product-stock-enabled-label"
                              id="product-stock-enabled"
                              value={model.stock.enabled}
                              onChange={e => {
                                const newModel = { ...model };
                                newModel.stock.enabled = e.target.value;
                                setModel(newModel);
                              }}
                            >
                              <MenuItem value={false}>{t("No")}</MenuItem>
                              <MenuItem value={true}>{t("Yes")}</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Quantity")}
                            id="product-quantity"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.stock.quantity,
                              onChange: e => {
                                const newModel = { ...model };
                                newModel.stock.quantity = e.target.value;
                                setModel(newModel);
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-outofstock-message"
                            label={t("Out of stock Message (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              const newModel = { ...model };
                              newModel.stock.outofstockMessage = e.target.value;
                              setModel(newModel);
                            }}
                            variant="outlined"
                            value={model.stock.outofstockMessage}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-outofstock-message-english"
                            label={t("Out of stock Message (English)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              const newModel = { ...model };
                              newModel.stock.outofstockMessageEN =
                                e.target.value;
                              setModel(newModel);
                            }}
                            variant="outlined"
                            value={model.stock.outofstockMessageEN}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h5 className={classes.heading}>{t("Combinations")}</h5>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <GridContainer>
                  <GridItem xs={12} lg={7}>
                    <AttributeTable
                      processing={processing}
                      attributes={model.attributes}
                      onSave={(attrIdx, valIdx, value) => {
                        const newModel = { ...model };
                        newModel.attributes[attrIdx].values[valIdx] = {
                          ...newModel.attributes[attrIdx].values[valIdx],
                          price: value.price,
                          cost: value.cost,
                          quantity: value.quantity
                        };
                        setModel(newModel);
                      }}
                      onDelete={(attrIdx, valIdx) => {
                        const newModel = { ...model };
                        const attribute = newModel.attributes[attrIdx];
                        attribute.values.splice(valIdx, 1);
                        if (!attribute.values.length) {
                          newModel.attributes.splice(attrIdx, 1);
                        }
                        setModel(newModel);
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} lg={5}>
                    <AttributeGenerator
                      attributes={attributes}
                      onGenerate={treeData => {
                        const newModel = { ...model };
                        newModel.attributes = [];
                        treeData.forEach(({ attrIdx, valIndices }) => {
                          const attribute = {
                            name: attributes[attrIdx].name,
                            nameEN: attributes[attrIdx].nameEN,
                            values: []
                          };
                          valIndices.forEach(valIdx => {
                            const { name, nameEN } = attributes[attrIdx].values[
                              valIdx
                            ];
                            const { price, cost } = newModel;
                            attribute.values.push({
                              name: name || "",
                              nameEN: nameEN || "",
                              price: price || 0,
                              cost: cost || 0,
                              quantity: newModel.stock.quantity || 0
                            });
                          });
                          newModel.attributes.push(attribute);
                        });
                        setModel(newModel);
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} lg={4}>
        <Card>
          <CardHeader>
            <h5 className={classes.heading}>{t("Category")}</h5>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                {!loading && (
                  <CategoryTree
                    treeData={categoryTreeData}
                    selectedCategoryId={model.categoryId}
                    onSelect={categoryId => setModel({ ...model, categoryId })}
                  />
                )}
              </GridItem>
              <GridItem xs={12} container direction="row-reverse">
                <Box mt={2}>
                  <Button variant="contained" href="../products">
                    <FormatListBulletedIcon />
                    {t("Back")}
                  </Button>
                </Box>
                <Box mt={2} mr={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={loading || processing || !model.name}
                    onClick={saveModel}
                  >
                    <SaveIcon />
                    {t("Save")}
                  </Button>
                </Box>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

EditAttributeValueRow.propTypes = {
  row: PropTypes.shape({
    attrName: PropTypes.string,
    valName: PropTypes.string,
    price: PropTypes.number,
    cost: PropTypes.number,
    quantity: PropTypes.number
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

AttributeTable.propTypes = {
  attributes: PropTypes.array,
  processing: PropTypes.bool,
  onDelete: PropTypes.func,
  onSave: PropTypes.func
};

AttributeGenerator.propTypes = {
  attributes: PropTypes.array,
  onGenerate: PropTypes.func
};

EditProduct.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

export default EditProduct;
