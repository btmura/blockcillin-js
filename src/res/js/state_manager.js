/*
 * Copyright (C) 2014  Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

var BC = (function(root) {

	/**
	 * StateManager is a module for managing state changes.
	 *
	 * Callers add state mutators to the manager and call the updateState function on each
	 * update to apply the mutators to the given state.
	 *
	 * When the mutator expires, the manager moves on to the next mutator in the queue. This
	 * allows callers to queue up multiple state changes.
	 */
	var me = root.StateManager = root.StateManager || {};

	// make makes a new StateManager object.
	me.make = function() {
		var Log = BC.Log;

		var stateMutatorQueue = [];
		var updateCounter = 0;

		/**
		 * addStateMutator adds the given mutator to the queue.
		 *
		 * @param newStateMutator - object with onStart, onUpdate, onFinish,
		 *                          and totalUpdates members
		 */
		function addStateMutator(newStateMutator) {
			if (!newStateMutator) {
				Log.error("newStateMutator is not defined");
				return;
			}
			stateMutatorQueue.push(newStateMutator);
		}

		/**
		 * updateState applies the current state mutator on the given state.
		 *
		 * @param state - the state that the mutators will work on
		 * @param stepPercent - 1 for a complete update step which will dequeue the mutator if
		 *                      finished or a fractional value if this is a partial step
		 *                      and mutators should not be dequeued
		 */
		function updateState(state, stepPercent) {
			if (stateMutatorQueue.length > 0) {
				var currentStateMutator = stateMutatorQueue[0];
				if (updateCounter === 0) {
					if (currentStateMutator.onStart) {
						currentStateMutator.onStart(state, stepPercent);
					}
				}
				if (currentStateMutator.onUpdate) {
					// TODO(btmura): pass values to callback using an object
					currentStateMutator.onUpdate(state, stepPercent, updateCounter);
				}

				// Don't increment the counter or dequeue mutators for partial updates,
				// because partial updates are just for rendering smooth animations and
				// don't move the game state forward.
				if (stepPercent === 1) {
					updateCounter++;
					if (updateCounter === currentStateMutator.totalUpdates) {
						if (currentStateMutator.onFinish) {
							currentStateMutator.onFinish(state, stepPercent);
						}
						stateMutatorQueue.shift();
						updateCounter = 0;
					}
				}
			}
		}

		return {
			addStateMutator: addStateMutator,
			updateState: updateState
		}
	};

	return root;

}(BC || {}));