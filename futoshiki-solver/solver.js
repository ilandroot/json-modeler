const fs = require("fs");

function create_hint(row,col,num){
    let cell_type = "hint";

    return {
        row,
        col,
        num,
        cell_type
    };

}
function create_input(row,col){
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
function create_futogo(lc_row,lc_col,uc_row,uc_col){
    return {
        lc_row,
        lc_col,
        uc_row,
        uc_col
    };
}
function create_futoshiki(size){
    let cells = [];
    let futogos = [];
    // 盤面の初期化 すべて入力セルで初期化する
    for (let r = 1; r <= size; r++){
        for (let c = 1; c <= size; c++){
            cells.push(create_input(r,c));
        }
    }
    return {
        size,
        cells,
        futogos
    };
}
function get_index(r,c,size){
    return (r - 1) * size + c -1 ;
}
function read_futoshiki(file) {
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
	futoshiki = create_futoshiki(size);
		
	for (const line of lines) {
		const parts = line.split(/\s+/);

		if (parts[0] === "hint") {
			const row = parseInt(parts[1], 10);
			const col = parseInt(parts[2], 10);
			const num = parseInt(parts[3], 10);

			const idx = get_index(row, col, size);
			futoshiki.cells[idx] = create_hint(row,col,num);
		}
		if (parts[0] === "futogo") {
			const r1 = parseInt(parts[1], 10);
			const c1 = parseInt(parts[2], 10);
			const r2 = parseInt(parts[3], 10);
			const c2 = parseInt(parts[4], 10);

			futoshiki.futogos.push(create_futogo(r1,c1,r2,c2));
		}
	}
	return futoshiki;
}
function print_cells(futoshiki) {
    for (const cell of futoshiki.cells) {
        console.log(cell);
    }
}
function init_options(futoshiki) {
	const size = futoshiki.size;

	for (const cell of futoshiki.cells) {
		if (cell.cell_type === "input" && cell.num === 0) {
		cell.options = [];
			for (let v = 1; v <= size; v++) {
				cell.options.push(v);
			}
		}
	}

	return futoshiki;
}
function fix_singletons(futoshiki) {
	for (const cell of futoshiki.cells) {
		if (cell.cell_type === "input" &&
			cell.num === 0 &&
			cell.options.length === 1) {

			cell.num = cell.options[0];
			cell.options = [];
		}
	}

	return futoshiki;
}
function count_unset_cells(futoshiki) {
	let count = 0;

	for (const cell of futoshiki.cells) {
		if (cell.cell_type === "input" && cell.num === 0) {
			count++;
		}
	}

	return count;
}
function count_unset_options(futoshiki) {
	let total = 0;

	for (const cell of futoshiki.cells) {
		if (cell.cell_type === "input" && cell.num === 0) {
			total += cell.options.length;
		}
	}

	return total;
}
function apply_rowcol_constraints(futoshiki) {
	for (const cell of futoshiki.cells) {
		if (cell.cell_type === "input" && cell.num === 0) {

			const rowValues = futoshiki.cells
				.filter(c => c.row === cell.row && c.num > 0)
				.map(c => c.num);

			const colValues = futoshiki.cells
				.filter(c => c.col === cell.col && c.num > 0)
				.map(c => c.num);

			cell.options = cell.options.filter(v =>
				!rowValues.includes(v) && !colValues.includes(v)
			);
		}
	}

	return futoshiki;
}
function apply_futogo_constraints(futoshiki) {
	const size = futoshiki.size;

	for (const f of futoshiki.futogos) {

		let idx = get_index(f.lc_row, f.lc_col, size);
		const lower = futoshiki.cells[idx];

		idx = get_index(f.uc_row, f.uc_col, size);
		const upper = futoshiki.cells[idx];

		if (!lower || !upper) continue;

		// lower 側
		if (lower.cell_type === "input" && lower.num === 0) {
			const upperMax = upper.num > 0
				? upper.num
				: Math.max(...upper.options);

			lower.options = lower.options.filter(v => v < upperMax);
    	}

		// upper 側
		if (upper.cell_type === "input" && upper.num === 0) {
			const lowerMin= lower.num > 0
				? lower.num
				: Math.min(...lower.options);

			upper.options = upper.options.filter(v => v > lowerMin);
		}
	}

  return futoshiki;
}
function print_flat_solution(futoshiki) {
	const N = futoshiki.size;
  
	for (let r = 1; r <= N; r++) {
		const result = [];
		for (let c = 1; c <= N; c++) {
			const index = get_index(r,c,N);
			result.push(futoshiki.cells[index].num);
		}
		console.log(result.join(" "));
	}
}
futoshiki = read_futoshiki("data.txt");  // 問題をファイルから読み込む
futoshiki = init_options(futoshiki);     // 候補を初期化する

let prev_unset_cells = Infinity;         // 未設定セル数 前回値
let prev_unset_options = Infinity;       // 候補数字の総和 前回値
let cur_unset_cells = -1;                // 未設定セル数 最新値
let cur_unset_options = -1;              // 候補数字の総和 最新値
while (true) {
	console.log("--ループ");
	cur_unset_cells = count_unset_cells(futoshiki);
	cur_unset_options = count_unset_options(futoshiki);
	console.log(`未設定セル数:${cur_unset_cells}`);
	console.log(`候補数字の総和:${cur_unset_options}`);

	if (cur_unset_cells === 0){
		break;
	}

	if (cur_unset_cells === prev_unset_cells &&
		cur_unset_options === prev_unset_options) {
		console.log("進展なし → ループ終了");
		break;
	}

	// 次回比較用に保存
	prev_unset_cells = cur_unset_cells;
	prev_unset_options = cur_unset_options;

	futoshiki = apply_rowcol_constraints(futoshiki);     // 行列制約により候補を除去する
	futoshiki = apply_futogo_constraints(futoshiki);     // 不等式制約により候補を除去する
	futoshiki = fix_singletons(futoshiki);               // 候補が1つのセルを確定する
}

if (cur_unset_cells === 0){
	console.log("=== 解 ===");
	print_flat_solution(futoshiki);
} else {
	console.log("*** 解けませんでした ***");
	print_cells(futoshiki);  // 結果を表示する
}
