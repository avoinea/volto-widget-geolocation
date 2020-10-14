import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';
import { unionBy } from 'lodash';

import Select, { components } from 'react-select';
import { biogeographicalData } from './biogeographical';
import { eeaCountries, eeaGroups } from './eeaCountries';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const messages = defineMessages({
  coverage: {
    id: 'Geographic coverage',
    defaultMessage: 'Geographic coverage',
  },
  group: {
    id: 'Geographic group',
    defaultMessage: 'Geographic group',
  },
});
const Group = (props) => <components.Group {...props} />;

const GeolocationWidget = (props) => {
  const { data, block, onChange, intl, id } = props;
  const [geoGroup, setGeoGroup] = useState([]);

  let options = [
    {
      label: 'Biogeographical regions',
      options: biogeographicalData,
    },
    {
      label: 'Countries groups',
      options: eeaCountries,
    },
  ];

  const getOptions = (arr, state) => {
    return state ? unionBy(arr, [...(state?.options || state)], 'label') : arr;
  };

  const handleChange = (e, value) => {
    let arr = [];
    arr = eeaCountries.filter((item) => item.group?.includes(e.label));
    setGeoGroup((prevState) => {
      return {
        label: 'Countries group',
        options: getOptions(arr, prevState),
      };
    });
  };

  return (
    <FormFieldWrapper {...props} columns={1}>
      <Grid>
        <Grid.Row stretched>
          <Grid.Column width="4">
            <div className="wrapper">
              <label htmlFor="select-listingblock-template">
                {intl.formatMessage(messages.group)}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
            <Select
              defaultValue={[]}
              id="select-listingblock-template"
              name="select-listingblock-template"
              className="react-select-container"
              classNamePrefix="react-select"
              options={eeaGroups}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              //value={selectedOption || []}
              onChange={(e, value) => handleChange(e, value)}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width="4">
            <div className="wrapper">
              <label htmlFor="select-listingblock-template">
                {intl.formatMessage(messages.coverage)}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
            <Select
              isMulti
              id="select-listingblock-template"
              name="select-listingblock-template"
              className="react-select-container"
              classNamePrefix="react-select"
              options={options}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option, Group }}
              value={
                geoGroup ? geoGroup.options || [...geoGroup] : data.geolocation
              }
              onChange={(field, value) => {
                setGeoGroup(() => field);
                onChange(field, value === '' ? undefined : value);
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </FormFieldWrapper>
  );
};

GeolocationWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
};

export default injectIntl(GeolocationWidget);
