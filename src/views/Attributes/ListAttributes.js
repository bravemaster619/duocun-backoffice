import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

const Attributes = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t("Attributes")}</h4>
              </GridItem>
              <GridItem
                xs={12}
                lg={6}
                container
                direction="row-reverse"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="default"
                  href="attributes/new"
                >
                  <AddCircleOutlineIcon />
                  {t("Add Attribute")}
              </Button>
              </GridItem>
            </GridContainer>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <TableContainer>
                  <Table
                    className={classes.table}
                    aria-label="Attribute Table"
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>{t("Attribute Name")}</TableCell>
                        <TableCell>{t("Actions")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableBodySkeleton colCount={3} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default Attributes;
