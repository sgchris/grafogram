import React, { useState, useRef, useEffect } from 'react';
import { Board } from '../../types';
import { ConfirmationModal } from '../UI';
import './BoardsPanel.css';

interface BoardsPanelProps {
  boards: Board[];
  activeBoard: Board | null;
  onBoardSelect: (board: Board) => void;
  onBoardRename: (boardId: string, newName: string) => void;
  onBoardDelete: (boardId: string) => void;
  onBoardCreate: () => void;
}

const BoardsPanel: React.FC<BoardsPanelProps> = ({
  boards,
  activeBoard,
  onBoardSelect,
  onBoardRename,
  onBoardDelete,
  onBoardCreate,
}) => {
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingBoardId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingBoardId]);

  const handleBoardClick = (board: Board) => {
    if (editingBoardId === board.id) return;
    onBoardSelect(board);
  };

  const handleBoardDoubleClick = (board: Board) => {
    setEditingBoardId(board.id);
    setEditName(board.name);
  };

  const handleEditSubmit = () => {
    if (editingBoardId && editName.trim()) {
      onBoardRename(editingBoardId, editName.trim());
    }
    setEditingBoardId(null);
    setEditName('');
  };

  const handleEditCancel = () => {
    setEditingBoardId(null);
    setEditName('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleEditCancel();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, board: Board) => {
    e.stopPropagation();
    if (boards.length > 1) {
      setBoardToDelete(board);
    }
  };

  const handleConfirmDelete = () => {
    if (boardToDelete) {
      onBoardDelete(boardToDelete.id);
      setBoardToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setBoardToDelete(null);
  };

  return (
    <div className="boards-panel">
      <div className="boards-panel-header">
        <h3 className="boards-panel-title">Boards</h3>
        <button 
          className="add-board-btn"
          onClick={onBoardCreate}
          title="Add new board"
        >
          +
        </button>
      </div>
      
      <div className="boards-list">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`board-item ${activeBoard?.id === board.id ? 'active' : ''}`}
            onClick={() => handleBoardClick(board)}
            onDoubleClick={() => handleBoardDoubleClick(board)}
          >
            <div className="board-content">
              {editingBoardId === board.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleEditSubmit}
                  onKeyDown={handleEditKeyDown}
                  className="board-name-input"
                />
              ) : (
                <span className="board-name" title={board.name}>
                  {board.name}
                </span>
              )}
              
              {boards.length > 1 && (
                <button
                  className="delete-board-btn"
                  onClick={(e) => handleDeleteClick(e, board)}
                  title="Delete board"
                >
                  🗑️
                </button>
              )}
            </div>
            
            <div className="board-meta">
              <span className="board-shapes-count">
                {board.shapes.length} shape{board.shapes.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {boardToDelete && (
        <ConfirmationModal
          title="Delete Board"
          message={`Are you sure you want to delete "${boardToDelete.name}"? This action cannot be undone and all drawings on this board will be lost.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default BoardsPanel;
