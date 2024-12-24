import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom'
import DataTable from '@/components/DataTable';
import type { FilterConfig } from '@/types/filterComponents.types';

const mockData = [
  {
    "id": 1,
    "name": "Cagatay",
  },
  {
    "id": 2,
    "name": "Eray"
  }
];

const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'name',
    label: 'Name',
  },
];

describe('DataTable', () => {
  describe('Rendering', () => {
    it('renders the table with correct headers', () => {
      render(<DataTable data={mockData} columns={columns} />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders data in correct cells', () => {
      render(<DataTable data={mockData} columns={columns} />);

    const firstIdCell = screen.getByText('1');
    const firstNameCell = screen.getByText('Cagatay');
    const secondIdCell = screen.getByText('2');
    const secondNameCell = screen.getByText('Eray');
    
    const firstRow = firstIdCell.closest('tr');
    const secondRow = secondIdCell.closest('tr');
    
    expect(firstRow).toContainElement(firstIdCell);
    expect(firstRow).toContainElement(firstNameCell);
    expect(secondRow).toContainElement(secondIdCell);
    expect(secondRow).toContainElement(secondNameCell);
    });

    it('shows loading state correctly', () => {
      render(<DataTable data={mockData} columns={columns} isLoading={true} />);

      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows "No records found" when data is empty', () => {
      render(<DataTable data={[]} columns={columns} />);

      expect(screen.getByText('No records found')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts by ID in ascending order when clicked once', async () => {
      render(<DataTable data={mockData} columns={columns} />);

      const idHeader = screen.getByText('ID');
      fireEvent.click(idHeader);

      const rows = screen.getAllByRole('row');
      const firstDataRow = within(rows[1]).getByText('1');
      const secondDataRow = within(rows[2]).getByText('2');

      expect(firstDataRow).toBeInTheDocument();
      expect(secondDataRow).toBeInTheDocument();
    });

    it('sorts by ID in descending order when clicked twice', () => {
      render(<DataTable data={mockData} columns={columns} />);

      const idHeader = screen.getByText('ID');
      fireEvent.click(idHeader);
      fireEvent.click(idHeader);

      const rows = screen.getAllByRole('row');
      const firstDataRow = within(rows[1]).getByText('2');
      const secondDataRow = within(rows[2]).getByText('1');

      expect(firstDataRow).toBeInTheDocument();
      expect(secondDataRow).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    const populatedMockData: {id: number, name: string}[] = []
    for (let i = 1; i <= 30; i++) {
      populatedMockData.push({id: i, name: `Mock_${i}`})
    }
    it('changes page size correctly', () => {
      render(<DataTable data={populatedMockData} columns={columns} />);

      const rowsPerPageSelect = screen.getByLabelText('Rows per page:');
      fireEvent.mouseDown(rowsPerPageSelect);

      const option = screen.getByRole('option', { name: '25' });
      fireEvent.click(option);

      expect(rowsPerPageSelect).toHaveTextContent('25');
    });

    it('shows correct range of data', () => {
      render(<DataTable data={populatedMockData} columns={columns} />);

      expect(screen.getByText('1-10 of 30')).toBeInTheDocument();
    });

    it('changes page number correctly', () => {
      render(<DataTable data={populatedMockData} columns={columns} />);

      const option = screen.getByRole('button', { name: /Go to next page/i });
      fireEvent.click(option);

      expect(screen.getByText('Mock_18')).toBeInTheDocument();

    });
  });

  describe('Export', () => {
    it('enables export button when data is present', () => {
      render(<DataTable data={mockData} columns={columns} exportable />);

      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeEnabled();
    });

    it('disables export button when loading', () => {
      render(<DataTable data={mockData} columns={columns} isLoading={true} exportable />);

      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeDisabled();
    });
  });

  describe('Row Click Handler', () => {
    it('calls onRowClick with correct row data', () => {
      const onRowClick = jest.fn();
      render(<DataTable data={mockData} columns={columns} onRowClick={onRowClick} />);

      const firstCell = screen.getByText('Cagatay');
      const row = firstCell.closest('tr');
      fireEvent.click(row!);
      
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
      });
  });

  describe('Filters', () => {
    const filters: FilterConfig[] = [
      {
        key: 'name',
        label: 'Name Filter',
        type: 'text'
      }
    ];

    it('shows and hides filters when toggle button is clicked', () => {
      render(<DataTable data={mockData} columns={columns} filters={filters} />);

      const toggleButton = screen.getByRole('button', { name: /hide filters/i });
      fireEvent.click(toggleButton);

      expect(screen.queryByLabelText('Name Filter')).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByLabelText('Name Filter')).toBeInTheDocument();
    });

    it('filters data based on text input', () => {
      render(<DataTable data={mockData} columns={columns} filters={filters} />);

      const filterInput = screen.getByLabelText('Name Filter');
      fireEvent.change(filterInput, { target: { value: 'Cagatay' } });

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(2); // Header + 1 data row
      expect(screen.getByText('Cagatay')).toBeInTheDocument();
      expect(screen.queryByText('Eray')).not.toBeInTheDocument();
    });

    it('clears filters when clear button is clicked', () => {
      render(<DataTable data={mockData} columns={columns} filters={filters} />);

      const filterInput = screen.getByLabelText('Name Filter');
      fireEvent.change(filterInput, { target: { value: 'Cagatay' } });

      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      fireEvent.click(clearButton);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3); // Header + 2 data rows
    });
  });
});