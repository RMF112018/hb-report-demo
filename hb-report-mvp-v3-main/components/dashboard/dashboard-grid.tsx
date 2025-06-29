'use client'; // Marks this component as client-side only to handle drag-and-drop functionality and dynamic grid rendering

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Drag-and-drop library for reordering cards
import { DashboardCard } from './dashboard-card'; // Reusable card component for dashboard items
import type { DashboardCard as DashboardCardType } from '@/types/dashboard'; // Type definition for dashboard cards

/**
 * DashboardGrid Component
 * @description A responsive grid component for displaying and managing dashboard cards. Supports drag-and-drop
 *              reordering in edit mode using @hello-pangea/dnd. Handles card visibility, sizing, and selection.
 *              Designed for client-side rendering to manage dynamic interactions and animations.
 */
interface DashboardGridProps {
  cards: DashboardCardType[]; // Array of dashboard card objects to render
  editMode: boolean; // Toggles between view and edit modes for drag-and-drop functionality
  onCardUpdate: (cardId: string, updates: any) => void; // Callback to update card properties (e.g., position)
  onCardRemove: (cardId: string) => void; // Callback to remove a card
  selectedCard: string | null; // ID of the currently selected card, or null if none
  onCardSelect: (cardId: string | null) => void; // Callback to handle card selection
}

export function DashboardGrid({
  cards,
  editMode,
  onCardUpdate,
  onCardRemove,
  selectedCard,
  onCardSelect,
}: DashboardGridProps) {
  // Filter cards to show only those marked as visible
  const visibleCards = cards.filter((card) => card.visible);

  /**
   * handleDragEnd Function
   * @description Handles the end of a drag-and-drop operation. Updates card positions based on the new order
   *              if the drop is valid and edit mode is active. Uses a 6-column grid layout for positioning.
   * @param {any} result - Drag result object from @hello-pangea/dnd containing source and destination indices
   */
  const handleDragEnd = (result: any) => {
    if (!result.destination || !editMode) return; // Exit if no destination or not in edit mode

    const sourceIndex = result.source.index; // Original position of the dragged card
    const destinationIndex = result.destination.index; // New position after drop

    if (sourceIndex === destinationIndex) return; // Exit if no movement occurred

    // Create a new array for reordering
    const updatedCards = Array.from(visibleCards);
    const [reorderedCard] = updatedCards.splice(sourceIndex, 1); // Remove card from source
    updatedCards.splice(destinationIndex, 0, reorderedCard); // Insert at destination

    // Update positions based on a 6-column grid
    updatedCards.forEach((card, index) => {
      const row = Math.floor(index / 6); // Calculate row based on index
      const col = index % 6; // Calculate column based on index
      onCardUpdate(card.id, { position: { x: col, y: row } }); // Update card position
    });
  };

  /**
   * getGridCols Function
   * @description Determines the column span for a card based on its size property.
   * @param {string} size - The size of the card (small, medium, large, xl)
   * @returns {string} Tailwind CSS class for column span
   */
  const getGridCols = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      case 'xl':
        return 'col-span-4';
      default:
        return 'col-span-2';
    }
  };

  /**
   * getGridRows Function
   * @description Determines the row span for a card based on its size property.
   * @param {string} size - The size of the card (small, medium, large, xl)
   * @returns {string} Tailwind CSS class for row span
   */
  const getGridRows = (size: string) => {
    switch (size) {
      case 'small':
        return 'row-span-1';
      case 'medium':
        return 'row-span-1'; // Compact layout
      case 'large':
        return 'row-span-2';
      case 'xl':
        return 'row-span-2'; // Compact height
      default:
        return 'row-span-1';
    }
  };

  /**
   * Edit Mode Rendering
   * @description Renders the grid with drag-and-drop functionality when editMode is true.
   *              Uses @hello-pangea/dnd components to enable reordering with visual feedback.
   */
  if (editMode) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-grid">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 auto-rows-fr"
            >
              {visibleCards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${getGridCols(card.size)} ${getGridRows(card.size)} ${
                        snapshot.isDragging ? 'opacity-75 rotate-1 scale-105' : ''
                      } transition-all duration-200`}
                    >
                      <DashboardCard
                        card={card}
                        onRemove={() => onCardRemove(card.id)}
                        onSelect={() => onCardSelect(card.id)}
                        isSelected={selectedCard === card.id}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  /**
   * View Mode Rendering
   * @description Renders the grid in view mode without drag-and-drop functionality.
   *              Suitable for end-user display with static card layout.
   */
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 auto-rows-fr">
      {visibleCards.map((card) => (
        <div key={card.id} className={`${getGridCols(card.size)} ${getGridRows(card.size)}`}>
          <DashboardCard
            card={card}
            onRemove={() => onCardRemove(card.id)}
            onSelect={() => onCardSelect(card.id)}
            isSelected={selectedCard === card.id}
          />
        </div>
      ))}
    </div>
  );
}