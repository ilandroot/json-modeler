const fs = require("fs");

function hint_cell(row, col, num) {
    let cell_type = "hint";
    return {
        row,
        col,
        num,
        cell_type
    };
}
function input_cell(row,col){
	let num = 0;
	let cell_type = "input";
	let options = [];
	return {
		row,
		col,
		num,
		cell_type,
		options
	};
}
function N_view(col,count) {
	let view_type = "N";
	return {
		view_type,
		count,
		col
	};
}
function S_view(col,count) {
	let view_type = "S";
	return {
		view_type,
		count,
		col
	};
}
function E_view(row,count){
	let view_type = "E";
	return {
		view_type,
		count,
		row
	};
}
function W_view(row,count){
	let view_type = "W";
	return {
		view_type,
		count,
		row
	};
}
function init_building(size){
    let cells = [];
    let views = [];
    for (let r = 1; r <= size; r++) {
        for (let c = 1; c <= size; c++) {
            cells.push(input_cell(r,c));
        }
    }
    return {
        size,
        cells,
        views
    };
}
function get_index(row,col,size){
    return (row - 1) * size + col - 1;
}
function read_building(file){
    const text = fs.readFileSync(file, "utf-8");
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    let size = 0;
    for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts[0] === "size") {
            size = parseInt(parts[1], 10);
            break;
        }
    }
    if (size === 0) {
        throw new Error("size が指定されていません");
    }
    building = init_building(size);

    for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts[0] === "hint") {
            const row = parseInt(parts[1], 10);
            const col = parseInt(parts[2], 10);
            const num = parseInt(parts[3], 10);
            const idx = get_index(row, col, size);
            building.cells[idx] = hint_cell(row,col,num);
        }
        if (parts[0] === "N") {
            const col = parseInt(parts[1], 10);
            const count = parseInt(parts[2], 10);
            building.views.push(N_view(col,count));
        }
        if (parts[0] === "S") {
            const col = parseInt(parts[1], 10);
            const count = parseInt(parts[2], 10);
            building.views.push(S_view(col,count));
        }
        if (parts[0] === "W") {
            const row = parseInt(parts[1], 10);
            const count = parseInt(parts[2], 10);
            building.views.push(W_view(row,count));
        }
        if (parts[0] === "E") {
            const row = parseInt(parts[1], 10);
            const count = parseInt(parts[2], 10);
            building.views.push(E_view(row,count));
        }
    }
    return building;
}
function print_cells(building){
    console.log("--- cells")
    for (const cell of building.cells) {
        console.log(cell);
    }
}
function print_views(building){
    console.log("--- views")
    for (const view of building.views) {
        console.log(view);
    }
}
function print_solution(building) {
    const size = building.size;
    for (let row = 1; row <= size; row++) {
        const row_cells = building.cells
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        const nums = row_cells.map(c => c.num).join(" ");
        console.log(nums);
    }
}
function init_options(building) {
    const size = building.size;
    for (const cell of building.cells) {
        if (cell.cell_type === "input" && cell.num === 0) {
            for (let v = 1; v <= size; v++) {
                cell.options.push(v);
            }
        }
    }
    return building;
}
function count_unset_cells(building) {
  let count = 0;
  for (const cell of building.cells) {
    if (cell.cell_type === "input" && cell.num === 0) {
        count++;
    }
  }
  return count;
}
function count_unset_options(building) {
  let total = 0;
  for (const cell of building.cells) {
    if (cell.cell_type === "input" && cell.num === 0) {
        const count = cell.options.length;
        total += count;
    }
  }
  return total;
}
function fix_singletons(building) {
	for (const cell of building.cells) {
		if (cell.cell_type === "input" &&
			cell.num === 0 &&
			cell.options.length === 1) {

			cell.num = cell.options[0];
			cell.options = [];
		}
	}
	return building;
}
function apply_latin_constraints(building) {
	const size = building.size;
	const cells = building.cells;
	for (const cell of cells) {
		if (cell.num > 0) {
			const v = cell.num;
			const r = cell.row;
			const c = cell.col;
			for (const other of cells) {
				if (other.cell_type === "input" && other.num === 0) {
					if (other.row === r || other.col === c) {
						other.options = other.options.filter(x => x !== v);
					}
				}
			}
		}
	}
	return building;
}
function apply_view_count_one(building){
    let size = building.size;
    let views = building.views;
    let cells = building.cells;
    for (let i = 0; i < views.length; i++){
        let view = views[i];
        if (view.count === 1){
            console.log(view);
            if (view.view_type === "N") {
                const col = view.col;
                const row = 1;
                const idx = get_index(row,col,size);
                const cell = cells[idx];
                if (cell.num === 0 && cell.cell_type === "input"){
                    cell.num = size;
                    cell.options = [];
                }
            }
            if (view.view_type === "S") {
                const col = view.col;
                const row = size;
                const idx = get_index(row,col,size);
                const cell = cells[idx];
                if (cell.num === 0 && cell.cell_type === "input"){
                    cell.num = size;
                    cell.options = [];
                }
            }
            if (view.view_type === "E") {
                const row = view.row;
                const col = size;
                const idx = get_index(row,col,size);
                const cell = cells[idx];
                if (cell.num === 0 && cell.cell_type === "input"){
                    cell.num = size;
                    cell.options = [];
                }
            }
            if (view.view_type === "W") {
                const row = view.row;
                const col = 1;
                const idx = get_index(row,col,size);
                const cell = cells[idx];
                if (cell.num === 0 && cell.cell_type === "input"){
                    cell.num = size;
                    cell.options = [];
                }
            }
        }
    }
    return building;
}
function generate_permutations(arr) {
	const results = [];

	function permute(prefix, rest) {
		if (rest.length === 0) {
			results.push(prefix);
			return;
		}
		for (let i = 0; i < rest.length; i++) {
			permute(
				[...prefix, rest[i]],
				[...rest.slice(0, i), ...rest.slice(i + 1)]
			);
		}
	}
	permute([], arr);
	return results;
}
function visible_count(arr) {
	let max = 0;
	let count = 0;
	for (const h of arr) {
		if (h > max) {
			max = h;
			count++;
		}
	}
	return count;
}
function matches_fixed_values(perm, row_cells) {
	for (let i = 0; i < row_cells.length; i++) {
		const cell = row_cells[i];
		if (cell.num !== 0 && perm[i] !== cell.num) {
			return false;
		}
	}
	return true;
}
function matches_view(perm, count) {
	return visible_count(perm) === count;
}
function apply_view_constraints_for_row(building, view){
	const row = view.row;
	const size = building.size;
	const view_type = view.view_type;
	let row_cells = [];
	row_cells = building.cells.filter(c => c.row === row);
	if (view_type === "E"){
		row_cells.reverse();
	}
	const perms = generate_permutations([...Array(size).keys()].map(i => i+1));
	const valid_perms = perms.filter(perm =>
		matches_fixed_values(perm, row_cells) &&
		matches_view(perm, view.count)
	);
	if (valid_perms.length === 1) {
		const p = valid_perms[0];
		for (let i = 0; i < size; i++) {
			const cell = row_cells[i];
			if (cell.num !== 0) continue;
				cell.num = p[i];
				cell.options = [];  // 候補は空にする
		}
		return building;
	}
	if (valid_perms.length > 1) {
		for (let i = 0; i < size; i++) {
			const cell = row_cells[i];
			if (cell.num !== 0) continue;
			const possible_values = new Set(valid_perms.map(p => p[i]));
			cell.options = cell.options.filter(v => possible_values.has(v));
		}
	}
	return building;
}
function apply_view_constraints_for_col(building, view){
	const col = view.col;
	const size = building.size;
	const view_type = view.view_type;
	let col_cells = building.cells
		.filter(c => c.col === col)
		.sort((a, b) => a.row - b.row);
	if (view_type === "S"){
		col_cells.reverse();
	}
	const perms = generate_permutations([...Array(size).keys()].map(i => i+1));
	const valid_perms = perms.filter(perm =>
		matches_fixed_values(perm, col_cells) &&
		matches_view(perm, view.count)
	);
	if (valid_perms.length === 1) {
		const p = valid_perms[0];
		for (let i = 0; i < size; i++) {
			const cell = col_cells[i];
			if (cell.num !== 0) continue;
			cell.num = p[i];
			cell.options = [];
		}
		return building;
	}
	if (valid_perms.length > 1) {
		for (let i = 0; i < size; i++) {
			const cell = col_cells[i];
			if (cell.num !== 0) continue;
			const possible_values = new Set(valid_perms.map(p => p[i]));
			cell.options = cell.options.filter(v => possible_values.has(v));
		}
	}
	return building;
}
function apply_general_view_constraints(building) {
	for (const view of building.views) {
		if (view.count === 1) continue;
		if (view.view_type === 'W' || view.view_type === 'E') {
			building = apply_view_constraints_for_row(building, view);
		} else if (view.view_type === 'N' || view.view_type === 'S') {
			building = apply_view_constraints_for_col(building, view);
		}
	}
	return building;
}
let obj;
obj = read_building("data.txt");
obj = init_options(obj);

let prev_unset_cells = Infinity;
let prev_unset_options = Infinity;
let cur_unset_cells;
let cur_unset_options;

console.log("ループ開始");
while (true) {
    cur_unset_cells = count_unset_cells(obj);     // 未設定セル数
    cur_unset_options = count_unset_options(obj); // 候補数字の総和
    if (cur_unset_cells === 0) {
        console.log("問題解決 → ループ終了");
        break;
    }
    if (cur_unset_cells === prev_unset_cells &&
        cur_unset_options === prev_unset_options) {
        console.log("進展なし → ループ終了");
        break;
    }
    console.log("未設定セル数:", cur_unset_cells);
    console.log("候補数の総和:", cur_unset_options);
    obj = apply_latin_constraints(obj); // ラテン方格
    obj = apply_view_count_one(obj); // ビュー count = 1
    obj = apply_general_view_constraints(obj); // ビュー制約をまとめて適用する関数(count = 1を除く)
    obj = fix_singletons(obj);
    prev_unset_cells = cur_unset_cells;
    prev_unset_options = cur_unset_options;
}

if (cur_unset_cells === 0) {
    console.log("=== 正解 ===");
    print_solution(obj);
} else {
    console.log("=== 失敗 ===");
    print_cells(obj);
    print_views(obj);
}