import type { FileSummary, RepoTreeNode } from '../types/projectControlCenter.js';

interface MutableRepoTreeNode {
  name: string;
  relativePath: string;
  type: 'directory' | 'file';
  children: MutableRepoTreeNode[];
  file?: FileSummary;
}

export function buildRepoTree(files: readonly FileSummary[]): RepoTreeNode {
  const root: MutableRepoTreeNode = {
    name: '.',
    relativePath: '',
    type: 'directory',
    children: []
  };

  for (const file of files) {
    insertFile(root, file);
  }

  return freezeTree(root);
}

function insertFile(root: MutableRepoTreeNode, file: FileSummary): void {
  const parts = file.relativePath.split('/');
  let current = root;
  let currentPath = '';

  for (const [index, part] of parts.entries()) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    const isFile = index === parts.length - 1;
    let child = current.children.find((candidate) => candidate.name === part);

    if (!child) {
      child = {
        name: part,
        relativePath: currentPath,
        type: isFile ? 'file' : 'directory',
        children: []
      };
      current.children.push(child);
    }

    if (isFile) {
      child.file = file;
      child.type = 'file';
    }

    current = child;
  }
}

function freezeTree(node: MutableRepoTreeNode): RepoTreeNode {
  const sortedChildren = [...node.children]
    .sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'directory' ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    })
    .map(freezeTree);

  return {
    name: node.name,
    relativePath: node.relativePath,
    type: node.type,
    children: sortedChildren,
    file: node.file
  };
}
