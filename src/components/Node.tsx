import React, { useCallback, useRef } from "react";
import { PrimitiveAtom, useAtom } from 'jotai'

import NodePosition from './NodePosition'
import Field from './Field'

import {  removeFieldAtom, createFieldAtom, Node as NodeType } from '../atoms'
import produce from "immer";
import { uuid } from "utils";
import clsx from "clsx";
import Edit from "icons/edit";
import { Link } from "react-router-dom";
import CircleAdd from "icons/circle-add";

type NodeProps = {
  nodeAtom: PrimitiveAtom<NodeType>
}

export default function Node({ nodeAtom }: NodeProps) {
  const [{ position, id, name, fields: fieldAtoms }, setNode] = useAtom(nodeAtom);
  const [, removeField] = useAtom(removeFieldAtom(nodeAtom))

  const nodeRef = useRef<HTMLDivElement>(null);

  const addField = useCallback(() => {
    setNode(produce(node => {
      node.fields.push(createFieldAtom({ id: uuid(), name: "New field "}))
    }))
  }, [setNode])

  const deleteField = useCallback((deleteId) => {
    // @ts-ignore
    removeField(deleteId)
  }, [removeField])

  const active = true

  return (
    <div
      className={
        clsx("rounded-lg overflow-hidden w-64 bg-gray-800 bg-opacity-75 fixed top-0 z-10", 
        !active && `border-2 border-gray-700 `,
        active && `border-3 border-green-500`)
      }
      style={{ transform: `translate3d(0, 0, .1)` }}
      ref={nodeRef}
    >
        <NodePosition nodeRef={nodeRef} positionAtom={position} >
          <div className="flex justify-between text-xs font-bold py-2 pb-1 px-4 bg-gray-100 text-gray-800" >
            <span>{name}</span>

            <span className="w-4 h-4">
              <Link to={`nodes/${id}`}>
                <Edit />
              </Link>
            </span>
          </div>
        </NodePosition>

        <div className="mt-2 p-2 ">
          {fieldAtoms.map((field, i) => <Field onDelete={deleteField} nodeId={id} fieldAtom={field} key={i} />)}
          <button onClick={addField} className="mt-4 text-gray-600 hover:text-green-500 w-4 h-4 m-auto block">
            <CircleAdd />
          </button>
        </div>
    </div>
  );
}
