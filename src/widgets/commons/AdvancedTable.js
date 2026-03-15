import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { FaSearch, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./AdvancedTable.css";

const AdvancedTable = ({
    columns,
    data,
    loading = false,
    onSearch,
    onFilter,
    onEdit,
    onDelete,
    onBulkDelete,
    onExport,
    filters = [],
    searchable = true,
    selectable = false,
    exportable = true,
    deletable = false,
    pagination = null,
    onPageChange,
    defaultLimit = 10
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterValues, setFilterValues] = useState({});

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                onSearch(searchTerm);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    // Handle filter change
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterValues, [key]: value };
        setFilterValues(newFilters);
        if (onFilter) {
            onFilter(newFilters);
        }
    };

    // Handle select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(data.map(item => item.id || item.ID));
        } else {
            setSelectedRows([]);
        }
    };

    // Handle select row
    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedRows.length > 0 && onBulkDelete) {
            const confirmed = window.confirm(`Hapus ${selectedRows.length} data yang dipilih?`);
            if (confirmed) {
                onBulkDelete(selectedRows);
                setSelectedRows([]);
            }
        }
    };

    // Handle export to Excel
    const handleExport = useCallback(async () => {
        if (onExport) {
            try {
                await onExport(data, columns);
            } catch (error) {
                console.error('Export error:', error);
            }
        }
    }, [onExport, data, columns]);

    // Handle page change
    const handlePageChange = (page) => {
        if (onPageChange) {
            onPageChange(page, defaultLimit);
        }
    };

    // Render filter dropdowns
    const renderFilters = useMemo(() => {
        if (filters.length === 0) return null;

        return (
            <div className="table-filters">
                {filters.map((filter, index) => (
                    <Form.Group key={index} className="table-filter-item">
                        <Form.Label>{filter.label}</Form.Label>
                        <Form.Select
                            value={filterValues[filter.key] || ""}
                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        >
                            <option value="">{filter.placeholder || `Semua ${filter.label}`}</option>
                            {filter.options && filter.options.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                ))}
            </div>
        );
    }, [filters, filterValues, handleFilterChange]);

    return (
        <div className="advanced-table">
            {/* Toolbar */}
            <div className="table-toolbar">
                <div className="table-toolbar-left">
                    {searchable && (
                        <InputGroup className="table-search">
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Cari data..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    )}
                </div>

                <div className="table-toolbar-right">
                    {selectable && selectedRows.length > 0 && (
                        <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                            <FaTrash /> Hapus ({selectedRows.length})
                        </Button>
                    )}

                    {exportable && onExport && (
                        <Button 
                            variant="success" 
                            size="sm" 
                            onClick={handleExport}
                            disabled={!data || data.length === 0}
                        >
                            <FaDownload /> Export Excel
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters */}
            {renderFilters}

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div className="table-loading">
                        <Spinner animation="border" variant="primary" />
                        <p>Memuat data...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive className="data-table">
                        <thead>
                            <tr>
                                {selectable && (
                                    <th className="checkbox-column">
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedRows.length === data.length && data.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {columns.map((column, index) => (
                                    <th key={index} style={column.style}>
                                        {column.header}
                                    </th>
                                ))}
                                {(deletable || onDelete) && (
                                    <th className="action-column">Aksi</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {selectable && (
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row.id || row.ID)}
                                                    onChange={() => handleSelectRow(row.id || row.ID)}
                                                />
                                            </td>
                                        )}
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex}>
                                                {column.render ? column.render(row) : row[column.accessor]}
                                            </td>
                                        ))}
                                        {(deletable || onDelete || onEdit) && (
                                            <td>
                                                <div className="action-buttons">
                                                    {onEdit && (
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => onEdit(row)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                    {onDelete && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => onDelete(row)}
                                                        >
                                                            <FaTrash /> Hapus
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + (selectable ? 1 : 0) + (deletable ? 1 : 0)} className="text-center">
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="table-pagination">
                    <div className="pagination-info">
                        Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} data
                    </div>
                    <div className="pagination-controls">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled={pagination.currentPage === 1}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                        >
                            <FaChevronLeft /> Prev
                        </Button>
                        <span className="pagination-pages">
                            Halaman {pagination.currentPage} dari {pagination.lastPage}
                        </span>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled={pagination.currentPage === pagination.lastPage}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                        >
                            Next <FaChevronRight />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedTable;
