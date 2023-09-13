import { Table, Input } from 'antd';
import { useState, useEffect } from 'react';
import { dataSource, columns } from '../data';
import { Resizable } from 'react-resizable';

const { Search } = Input;

const ResizableColumn = (props) => {
  const { onResize, width, ...restProps } = props;

  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: true }}>
      <td {...restProps} />
    </Resizable>
  );
};

const AgoraDatatable = () => {
  const [searchValue, setSearchValue] = useState('');
  const [tableColumns, setTableColumns] = useState(columns);

  const searchData = dataSource.filter((item) => {
    const nameContains = item.name.toLowerCase().includes(searchValue.toLowerCase());
    const descriptionContains =
      item.description && item.description.toLowerCase().includes(searchValue.toLowerCase());

    return nameContains || descriptionContains;
  });

  const handleResize =
    (index) =>
    (e, { size }) => {
      setTableColumns((prevColumns) => {
        const nextColumns = [...prevColumns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };

        const nextWidths = nextColumns.map((col) => col.width);
        localStorage.setItem('resizedColumnsWidths', JSON.stringify(nextWidths));

        return nextColumns;
      });
    };

  const components = {
    header: {
      cell: ResizableColumn,
    },
  };

  const resizedColumns = tableColumns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  useEffect(() => {
    const savedColumnWidths = localStorage.getItem('resizedColumnsWidths');
    if (savedColumnWidths) {
      const widths = JSON.parse(savedColumnWidths);
      setTableColumns(
        columns.map((col, index) => ({
          ...col,
          width: widths[index] || col.width,
        })),
      );
    }
  }, []);

  return (
    <div>
      <Search
        className="custom-search"
        placeholder="Search..."
        onSearch={(value) => setSearchValue(value)}
        enterButton
      />
      <Table bordered components={components} dataSource={searchData} columns={resizedColumns} />
    </div>
  );
};

export default AgoraDatatable;
