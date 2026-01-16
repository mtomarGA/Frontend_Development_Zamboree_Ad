'use client'
import {
  Avatar, Chip, MenuItem, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Typography,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import tableStyles from '@core/styles/table.module.css';
import DialogCloseButton from '@/components/dialogs/DialogCloseButton';
import CustomTextField from '@/@core/components/mui/TextField';
import PaginationRounded from './pagination';
import categoryRoute from '@/services/utsav/category';
import Image from '@/services/imageService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

// Drag and Drop
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function Tab3({ categorydata, statusStyles, getcategorydata, itemsPerPage, setItemsPerPage, setCurrentPage, currentPage }) {
  const { hasPermission } = useAuth();

  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'sort_id', direction: 'asc' });

  // const [currentWebThumbnail, setCurrentWebThumbnail] = useState('');
  // const [currentMobThumbnail, setCurrentMobThumbnail] = useState('');
  // const [currenticon, setCurrenticon] = useState('');


  // const [selectedWebFile, setSelectedWebFile] = useState(null);
  // const [selectedMobFile, setSelectedMobFile] = useState(null);
  // const [selectedicon, setSelectedicon] = useState(null);

  const [imageData, setImageData] = useState({
    webthumbnail: { url: '', loading: false },
    mobthumbnail: { url: '', loading: false },
    icon: { url: '', loading: false }
  });


  const [Categoryupdate, setcategoryupdate] = useState({});
  // const [Categoryupdateimage, setCategoryupdateimage] = useState({});
  const [Categoryopen, setCategoryOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleCategoryOpen = () => setCategoryOpen(true);
  const handleCategoryClose = () => setCategoryOpen(false);

  const validateFields = data => {
    let errors = {};

    if (!data.categoryname) errors.categoryname = 'Category name is required';
    if (!data.status) errors.status = 'Status is required';

    if (!imageData.webthumbnail.url)
      errors.webthumbnail = 'Web thumbnail is required';

    if (!imageData.mobthumbnail.url)
      errors.mobthumbnail = 'Mobile thumbnail is required';

    if (!imageData.icon.url)
      errors.icon = 'icon is required';

    return errors;
  };

  const OnchangeCategory = (e) => {
    setcategoryupdate({ ...Categoryupdate, [e.target.name]: e.target.value });
  };

  const onchangeimage = async (e) => {
    const name = e.target.name;
    const file = e.target.files[0];

    if (!file) return;

    setImageData(prev => ({
      ...prev,
      [name]: { ...prev[name], loading: true }
    }));

    try {
      const result = await Image.uploadImage({ image: file });

      if (result.data.url) {
        setImageData(prev => ({
          ...prev,
          [name]: { url: result.data.url, loading: false }
        }));

        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed");
      setImageData(prev => ({
        ...prev,
        [name]: { ...prev[name], loading: false }
      }));
    }
  };

  const updateCategory = async (id) => {
    try {
      const response = await categoryRoute.getdatabyid(id);
      setcategoryupdate({
        categoryname: response.data.categoryname,
        status: response.data.status,
        id: response.data._id
      });
      setImageData(prev => ({
        ...prev,
        webthumbnail: { url: response.data.webthumbnail, loading: false },
        mobthumbnail: { url: response.data.mobthumbnail, loading: false },
        icon: { url: response.data.icon, loading: false }
      }))
      // setCurrentWebThumbnail(response.data.webthumbnail);
      // setCurrentMobThumbnail(response.data.mobthumbnail);
      // setCurrenticon(response.data.icon);
      // setSelectedWebFile(null);
      // setSelectedicon(null);
      // setSelectedMobFile(null);
      handleCategoryOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const updatereq = async id => {
    const { categoryname, status } = Categoryupdate;
    const formData = new FormData();
    formData.append("categoryname", categoryname);
    formData.append("status", status);

    if (imageData.webthumbnail.url) formData.append("webthumbnail", imageData.webthumbnail.url);
    if (imageData.mobthumbnail.url) formData.append("mobthumbnail", imageData.mobthumbnail.url);
    if (imageData.icon.url) formData.append("icon", imageData.icon.url);


    const errors = validateFields(Categoryupdate);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    await categoryRoute.putData(id, formData);
    getcategorydata();
    handleCategoryClose();
    toast.success('Category Updated');
  };

  const deletecategory = async (id) => {
    try {
      await categoryRoute.deleteData(id);
      getcategorydata();
      toast.success('Category Deleted');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Use useMemo to prevent unnecessary re-sorting
  const sortedData = useMemo(() => {
    const dataToSort = [...categorydata];

    return dataToSort.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle undefined/null values
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      } else {
        return 0;
      }
    });
  }, [categorydata, sortConfig]);

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle drag end - Simple swap approach
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    // Get dragged item and target item from sorted data
    const draggedItem = sortedData[result.source.index];
    const targetItem = sortedData[result.destination.index];

    // If same item or sort_id is same, do nothing
    if (draggedItem._id === targetItem._id || draggedItem.sort_id === targetItem.sort_id) {
      return;
    }

    // Swap sort_id values between dragged item and target item
    const categoriesToUpdate = [
      {
        _id: draggedItem._id,
        sort_id: targetItem.sort_id
      },
      {
        _id: targetItem._id,
        sort_id: draggedItem.sort_id
      }
    ];

    try {
      // Call API to update order
      const response = await categoryRoute.updateOrder({ categories: categoriesToUpdate });

      if (response.success) {
        toast.success('Category order updated successfully');
        // Refresh the data to get the updated order
        getcategorydata();
      } else {
        toast.error('Failed to update category order');
      }
    } catch (error) {
      console.error('Error updating category order:', error);
      toast.error('Error updating category order');
    }
  };

  return (
    <>
      {/* Edit Category Modal */}
      <Dialog onClose={handleCategoryClose} open={Categoryopen} fullWidth PaperProps={{ sx: { overflow: 'visible' } }}>
        <DialogTitle>
          <Typography variant='h4' component='span'>Edit Category</Typography>
          <DialogCloseButton onClick={handleCategoryClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <div className='flex flex-col m-4'>
            <TextField
              name='categoryname'
              label='Category Name'
              onChange={OnchangeCategory}
              fullWidth
              value={Categoryupdate.categoryname || ''}
              error={!!formErrors.categoryname}
              helperText={formErrors.categoryname}
            />
          </div>

          <div className='flex flex-col m-2'>
            <label htmlFor='webimage' className='mx-2'>Web Thumbnail Image</label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input type='file' name='webthumbnail' hidden onChange={onchangeimage} id='webimage' accept='image/*' />
              </Button>
              <Typography variant="body2" className="mt-1 text-green-600 truncate inline-block w-96">
                {imageData.webthumbnail.loading
                  ? (<CircularProgress size={20} />)
                  : <Avatar src={imageData.webthumbnail.url} />} {imageData.webthumbnail.url || "No file selected"}
              </Typography>
              {formErrors.webthumbnail && <FormHelperText error>{formErrors.webthumbnail}</FormHelperText>}

            </div>
          </div>

          <div className='flex flex-col m-2'>
            <label htmlFor='mobimage' className='mx-2'>Mobile Thumbnail Image</label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input type='file' name='mobthumbnail' hidden onChange={onchangeimage} id='mobimage' accept='image/*' />
              </Button>
              <Typography variant="body2" className="mt-1 text-green-600 truncate inline-block w-96">
                {imageData.mobthumbnail.loading
                  ? (<CircularProgress size={20} />)
                  : <Avatar src={imageData.mobthumbnail.url} />} {imageData.mobthumbnail.url || "No file selected"}
              </Typography>
              {formErrors.mobthumbnail && <FormHelperText error>{formErrors.mobthumbnail}</FormHelperText>}

            </div>
          </div>

          <div className='flex flex-col m-2'>
            <label htmlFor='icon' className='mx-2'>icon</label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input type='file' name='icon' hidden onChange={onchangeimage} id='icon' accept='image/*' />
              </Button>
              <Typography variant="body2" className="mt-1 text-green-600 truncate inline-block w-96">
                {imageData.icon.loading
                  ? (<CircularProgress size={20} />)
                  : <Avatar src={imageData.icon.url} />} {imageData.icon.url || "No file selected"}
              </Typography>
              {formErrors.icon && <FormHelperText error>{formErrors.icon}</FormHelperText>}

            </div>
          </div>

          <div className='m-4'>
            <CustomTextField
              className='my-2'
              select
              fullWidth
              name='status'
              label='Status'
              value={Categoryupdate.status || ''}
              error={!!formErrors.status}
              helperText={formErrors.status}
              slotProps={{ select: { onChange: OnchangeCategory } }}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>
        </DialogContent>
        <DialogActions>
          {hasPermission('utsav_master:edit') &&
            <Button onClick={() => updatereq(Categoryupdate.id)} variant='contained'>Update Category</Button>
          }
          <Button onClick={handleCategoryClose} variant='tonal' color='secondary'>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rows per page */}
      {/* <div className="flex items-center justify-between p-4">
        <div>
          <span>Rows per page: </span>
          <Select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            size="small"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
      </div> */}

      {/* Drag and Drop Table */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <TableContainer className='p-4' ref={provided.innerRef} {...provided.droppableProps}>
              <Table className={tableStyles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Drag</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'sort_id'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('sort_id')}
                      >
                        Sort No
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'categoryname'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('categoryname')}
                      >
                        Category Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>icon</TableCell>
                    <TableCell>Web thumbnail</TableCell>
                    <TableCell>Mobile thumbnail</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'status'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='border-b'
                        >
                          <TableCell className='p-2'>
                            <div {...provided.dragHandleProps} className='cursor-grab'>
                              ⋮⋮
                            </div>
                          </TableCell>
                          <TableCell className='p-2'>
                            {item?.sort_id || 'N/A'}
                          </TableCell>
                          <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                            {item.categoryname}
                          </TableCell>
                          <TableCell className='p-2'>
                            <Avatar src={item.icon || '/images/default-thumbnail.png'} />
                          </TableCell>
                          <TableCell className='p-2'>
                            <Avatar src={item.webthumbnail || '/images/default-thumbnail.png'} />
                          </TableCell>
                          <TableCell className='p-2'>
                            <Avatar src={item.mobthumbnail || '/images/default-thumbnail.png'} />
                          </TableCell>
                          <TableCell className='p-2'>
                            <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                          </TableCell>
                          <TableCell className='px-4 py-2 flex items-center gap-3'>
                            {hasPermission('utsav_master:edit') &&
                              <Pencil className='text-blue-500 cursor-pointer' onClick={() => { updateCategory(item._id); handleCategoryOpen(); }} />}
                            {hasPermission('utsav_master:delete') &&
                              <Trash2 className='text-red-500 cursor-pointer' onClick={() => deletecategory(item._id)} />}
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>

      <div className='m-2 flex justify-end'>
        <PaginationRounded
          count={Math.ceil(sortedData.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      </div>
    </>
  );
}

export default Tab3;
