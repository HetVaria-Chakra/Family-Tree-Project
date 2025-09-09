// Family Tree Data Management
class FamilyTree {
    constructor() {
        this.members = new Map();
        this.loadData();
        this.initializeEventListeners();
        this.renderTree();
    }

    // Add a new family member
    addMember(memberData) {
        const id = this.generateId();
        const member = {
            id: id,
            name: memberData.name,
            birthDate: memberData.birthDate,
            gender: memberData.gender,
            parentId: memberData.parentId || null,
            spouseId: memberData.spouseId || null,
            children: []
        };

        this.members.set(id, member);

        // Update parent's children list
        if (member.parentId) {
            const parent = this.members.get(member.parentId);
            if (parent && !parent.children.includes(id)) {
                parent.children.push(id);
            }
        }

        // Update spouse relationship
        if (member.spouseId) {
            const spouse = this.members.get(member.spouseId);
            if (spouse) {
                spouse.spouseId = id;
            }
        }

        this.saveData();
        this.renderTree();
        return id;
    }

    // Remove a family member
    removeMember(id) {
        const member = this.members.get(id);
        if (!member) return;

        // Remove from parent's children
        if (member.parentId) {
            const parent = this.members.get(member.parentId);
            if (parent) {
                parent.children = parent.children.filter(childId => childId !== id);
            }
        }

        // Update spouse
        if (member.spouseId) {
            const spouse = this.members.get(member.spouseId);
            if (spouse) {
                spouse.spouseId = null;
            }
        }

        // Reassign children to parent or make them roots
        member.children.forEach(childId => {
            const child = this.members.get(childId);
            if (child) {
                child.parentId = member.parentId;
                if (member.parentId) {
                    const grandparent = this.members.get(member.parentId);
                    if (grandparent && !grandparent.children.includes(childId)) {
                        grandparent.children.push(childId);
                    }
                }
            }
        });

        this.members.delete(id);
        this.saveData();
        this.renderTree();
    }

    // Get family tree structure organized by generations
    getTreeStructure() {
        const roots = Array.from(this.members.values()).filter(member => !member.parentId);
        const structure = [];

        const buildGeneration = (parents, generation = 0) => {
            if (parents.length === 0) return;

            if (!structure[generation]) {
                structure[generation] = [];
            }

            const children = new Set();
            
            parents.forEach(parent => {
                structure[generation].push(parent);
                parent.children.forEach(childId => {
                    const child = this.members.get(childId);
                    if (child) {
                        children.add(child);
                    }
                });
            });

            if (children.size > 0) {
                buildGeneration(Array.from(children), generation + 1);
            }
        };

        buildGeneration(roots);
        return structure;
    }

    // Render the family tree
    renderTree() {
        const treeContainer = document.getElementById('familyTree');
        const structure = this.getTreeStructure();

        if (structure.length === 0) {
            treeContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Your Family Tree is Empty</h3>
                    <p>Start building your family tree by adding the first family member</p>
                    <button class="btn btn-primary" onclick="familyTree.openAddMemberModal()">Add First Member</button>
                </div>
            `;
            return;
        }

        let html = '';
        structure.forEach((generation, index) => {
            html += `<div class="generation">`;
            
            // Group spouses together
            const processed = new Set();
            generation.forEach(member => {
                if (processed.has(member.id)) return;

                const spouse = member.spouseId ? this.members.get(member.spouseId) : null;
                
                html += `<div class="family-group">`;
                html += `<div class="spouse-group">`;
                html += this.renderMember(member);
                
                if (spouse && generation.includes(spouse)) {
                    html += this.renderMember(spouse);
                    processed.add(spouse.id);
                }
                
                html += `</div>`;
                html += `</div>`;
                processed.add(member.id);
            });
            
            html += `</div>`;
            
            if (index < structure.length - 1) {
                html += `<div class="connection-line"></div>`;
            }
        });

        treeContainer.innerHTML = html;
        this.updateFormOptions();
    }

    // Render individual family member
    renderMember(member) {
        const age = member.birthDate ? this.calculateAge(member.birthDate) : '';
        const ageText = age ? ` (${age})` : '';
        
        return `
            <div class="family-member ${member.gender}" data-id="${member.id}">
                <div class="member-actions">
                    <button class="action-btn" onclick="familyTree.editMember('${member.id}')" title="Edit">✏️</button>
                    <button class="action-btn" onclick="familyTree.removeMember('${member.id}')" title="Delete">🗑️</button>
                </div>
                <div class="member-name">${member.name}</div>
                <div class="member-details">
                    ${member.birthDate ? new Date(member.birthDate).toLocaleDateString() : ''}${ageText}
                </div>
            </div>
        `;
    }

    // Calculate age from birth date
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // Update form dropdown options
    updateFormOptions() {
        const parentSelect = document.getElementById('memberParent');
        const spouseSelect = document.getElementById('memberSpouse');
        
        // Clear existing options except first
        parentSelect.innerHTML = '<option value="">None (Root)</option>';
        spouseSelect.innerHTML = '<option value="">None</option>';
        
        // Add all members as potential parents and spouses
        this.members.forEach(member => {
            parentSelect.innerHTML += `<option value="${member.id}">${member.name}</option>`;
            spouseSelect.innerHTML += `<option value="${member.id}">${member.name}</option>`;
        });
    }

    // Generate unique ID
    generateId() {
        return 'member_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add member button
        document.getElementById('addMemberBtn').addEventListener('click', () => {
            this.openAddMemberModal();
        });

        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            this.closeAddMemberModal();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeAddMemberModal();
        });

        // Form submission
        document.getElementById('addMemberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddMember();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        // Import file handler
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('addMemberModal');
            if (e.target === modal) {
                this.closeAddMemberModal();
            }
        });
    }

    // Open add member modal
    openAddMemberModal() {
        document.getElementById('addMemberModal').style.display = 'block';
        this.updateFormOptions();
        this.resetForm();
    }

    // Close add member modal
    closeAddMemberModal() {
        document.getElementById('addMemberModal').style.display = 'none';
        this.resetForm();
    }

    // Reset form
    resetForm() {
        document.getElementById('addMemberForm').reset();
    }

    // Handle add member form submission
    handleAddMember() {
        const formData = new FormData(document.getElementById('addMemberForm'));
        const memberData = {
            name: document.getElementById('memberName').value.trim(),
            birthDate: document.getElementById('memberBirthDate').value,
            gender: document.getElementById('memberGender').value,
            parentId: document.getElementById('memberParent').value || null,
            spouseId: document.getElementById('memberSpouse').value || null
        };

        if (!memberData.name) {
            alert('Please enter a name for the family member.');
            return;
        }

        this.addMember(memberData);
        this.closeAddMemberModal();
    }

    // Edit member (placeholder for future enhancement)
    editMember(id) {
        const member = this.members.get(id);
        if (!member) return;

        // For now, show member details in alert
        // In a full implementation, this would open an edit modal
        alert(`Edit functionality for ${member.name} will be implemented in a future version.`);
    }

    // Save data to localStorage
    saveData() {
        const data = {
            members: Array.from(this.members.entries())
        };
        localStorage.setItem('familyTreeData', JSON.stringify(data));
    }

    // Load data from localStorage
    loadData() {
        const saved = localStorage.getItem('familyTreeData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.members = new Map(data.members || []);
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.members = new Map();
            }
        }
    }

    // Export data as JSON file
    exportData() {
        const data = {
            familyTree: Array.from(this.members.entries()),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'family-tree-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import data from JSON file
    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.familyTree && Array.isArray(data.familyTree)) {
                    const confirmImport = confirm('This will replace your current family tree. Continue?');
                    if (confirmImport) {
                        this.members = new Map(data.familyTree);
                        this.saveData();
                        this.renderTree();
                        alert('Family tree imported successfully!');
                    }
                } else {
                    alert('Invalid file format. Please select a valid family tree export file.');
                }
            } catch (error) {
                alert('Error reading file. Please make sure it\'s a valid JSON file.');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
        // Clear the file input
        document.getElementById('importFile').value = '';
    }
}

// Initialize the family tree when the page loads
let familyTree;
document.addEventListener('DOMContentLoaded', () => {
    familyTree = new FamilyTree();
});