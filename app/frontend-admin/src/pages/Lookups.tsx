import React, { useState } from 'react';
import { createSafetyEquipment, deleteSafetyEquipment, updateSafetyEquipment, createLocation, updateLocation, deleteLocation, createPermitType, updatePermitType, deletePermitType } from '../../../shared/services/api';
import { useLookups } from '../hooks/useLookups';
import ManageList from '../components/ManageList';
import ManagerAssignmentModal from '../components/modals/ManagerAssignmentModal';

const Lookups: React.FC = () => {
  const { permitTypes, locations, users, safetyEquipment, loading, error, refetch } = useLookups();

  // Assignment Modal State
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'location' | 'permit_type' | 'department'>('location');
  const [assignmentItem, setAssignmentItem] = useState<{ id: number; name: string } | null>(null);

  const handleAddSafetyEquipment = async () => {
    const name = window.prompt("Enter new safety equipment name:");
    if (!name) return;
    try {
      await createSafetyEquipment(name);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to create safety equipment');
    }
  };

  const handleEditSafetyEquipment = async (item: any) => {
    const name = window.prompt("Edit safety equipment name:", item.name);
    if (!name || name === item.name) return;
    try {
      await updateSafetyEquipment(item.id, name);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to update safety equipment');
    }
  };

  const handleRemoveSafetyEquipment = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this safety equipment?')) return;
    try {
      await deleteSafetyEquipment(id);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to delete safety equipment');
    }
  };

  // Location handlers
  const handleAddLocation = async () => {
    const name = window.prompt("Enter new location name:");
    if (!name) return;
    try {
      await createLocation(name);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to create location');
    }
  };

  const handleEditLocation = async (item: any) => {
    const name = window.prompt("Edit location name:", item.name);
    if (!name || name === item.name) return;
    try {
      await updateLocation(item.id, name);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to update location');
    }
  };

  const handleRemoveLocation = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this location?')) return;
    try {
      await deleteLocation(id);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to delete location');
    }
  };

  // Permit Type handlers
  const handleAddPermitType = async () => {
    const name = window.prompt("Enter new permit type name:");
    if (!name) return;
    try {
      await createPermitType(name);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to create permit type');
    }
  };

  const handleEditPermitType = async (item: any) => {
    const name = window.prompt("Edit permit type name:", item.name);
    if (!name || name === item.name) return;
    try {
      await updatePermitType(item.id, name);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to update permit type');
    }
  };

  const handleRemovePermitType = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this permit type?')) return;
    try {
      await deletePermitType(id);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to delete permit type');
    }
  };

  const handleAssignLocation = (item: any) => {
    setAssignmentType('location');
    setAssignmentItem(item);
    setAssignmentModalOpen(true);
  };

  const handleAssignPermitType = (item: any) => {
    setAssignmentType('permit_type');
    setAssignmentItem(item);
    setAssignmentModalOpen(true);
  };

  // Remove first 3 placeholder entries (development artifacts) before rendering
  const visibleLocations = (locations || []).slice(3);
  const visiblePermitTypes = (permitTypes || []).slice(3);

  return (
    <div className="content-area">
      <h1 className="page-title">Lookup Data Management</h1>
      
      {error && <div className="form-error-text" style={{ marginBottom: 10 }}>{error}</div>}

      <ManageList
        title="Safety Equipment"
        items={safetyEquipment || []}
        loading={loading}
        onAdd={handleAddSafetyEquipment}
        onEdit={handleEditSafetyEquipment}
        onDelete={handleRemoveSafetyEquipment}
      />

      <ManageList
        title="Locations"
        items={visibleLocations}
        loading={loading}
        onAdd={handleAddLocation}
        onEdit={handleEditLocation}
        onDelete={handleRemoveLocation}
        onAssign={handleAssignLocation}
      />

      <ManageList
        title="Permit Types"
        items={visiblePermitTypes}
        loading={loading}
        onAdd={handleAddPermitType}
        onEdit={handleEditPermitType}
        onDelete={handleRemovePermitType}
        onAssign={handleAssignPermitType}
      />

      <ManagerAssignmentModal
        open={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        type={assignmentType}
        item={assignmentItem}
        allUsers={users}
      />
    </div>
  );
};

export default Lookups;