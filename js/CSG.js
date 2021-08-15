// Taken from:
// https://github.com/looeee/threejs-csg
//
// Demodulized. Merged into a single file.



// Holds a node in adaptive partitioning BSP tree, built from a collection of polygons
// by picking a polygon to split along. That polygon (and all other coplanar
// polygons) are added directly to that node and the other polygons are added to
// the front and/or back subtrees.

class BSPNode {
  constructor(polygons) {
    this.plane = null;
    this.front = null;
    this.back = null;
    this.polygons = [];
    if (polygons) this.build(polygons);
  }

  clone() {
    const node = new BSPNode();
    node.plane = this.plane && this.plane.clone();
    node.front = this.front && this.front.clone();
    node.back = this.back && this.back.clone();
    node.polygons = this.polygons.map(function (p) {
      return p.clone();
    });
    return node;
  }

  // Convert solid space to empty space and empty space to solid space.
  invert() {
    for (let i = 0; i < this.polygons.length; i++) {
      this.polygons[i].negate();
    }
    this.plane.negate();
    if (this.front) this.front.invert();
    if (this.back) this.back.invert();
    const temp = this.front;
    this.front = this.back;
    this.back = temp;
  }

  // Recursively remove all polygons in `polygons` that are inside this BSP
  // tree.
  clipPolygons(polygons) {
    if (!this.plane) return polygons.slice();
    let front = [];
    let back = [];
    for (let i = 0; i < polygons.length; i++) {
      this.plane.splitPolygon(polygons[i], front, back, front, back);
    }
    if (this.front) front = this.front.clipPolygons(front);
    if (this.back) back = this.back.clipPolygons(back);
    else back = [];
    return front.concat(back);
  }

  // Remove all polygons in this BSP tree that are inside the other BSP tree
  // `bsp`.
  clipTo(bsp) {
    this.polygons = bsp.clipPolygons(this.polygons);
    if (this.front) this.front.clipTo(bsp);
    if (this.back) this.back.clipTo(bsp);
  }

  // Return a list of all polygons in this BSP tree.
  allPolygons() {
    let polygons = this.polygons.slice();
    if (this.front)
      polygons = polygons.concat(this.front.allPolygons());
    if (this.back)
      polygons = polygons.concat(this.back.allPolygons());
    return polygons;
  }

  // Build a BSP tree out of `polygons`. When called on an existing tree, the
  // new polygons are filtered down to the bottom of the tree and become new
  // nodes there. Each set of polygons is partitioned using the first polygon
  // (no heuristic is used to pick a good split).
  build(polygons) {
    if (!polygons.length) return;
    if (!this.plane) this.plane = polygons[0].plane;
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      this.plane.splitPolygon(
        polygons[i],
        this.polygons,
        this.polygons,
        front,
        back,
      );
    }
    if (front.length) {
      if (!this.front) this.front = new BSPNode();
      this.front.build(front);
    }
    if (back.length) {
      if (!this.back) this.back = new BSPNode();
      this.back.build(back);
    }
  }
}


var _vector1 = new THREE.Vector3();
var _vector2 = new THREE.Vector3();

class CuttingPlane extends THREE.Plane {
  constructor(normal, constant) {
    super(normal, constant);
  }

  fromPoints(a, b, c) {
    const normal = b
      .subVectors(b, a)
      .cross(_vector2.subVectors(c, a))
      .normalize();

    this.normal = normal;
    this.constant = normal.dot(a);

    return this;
  }

  setFromCoplanarPoints(a, b, c) {
    var normal = _vector1
      .subVectors(c, b)
      .cross(_vector2.subVectors(a, b))
      .normalize();

    this.setFromNormalAndCoplanarPoint(normal, a);

    return this;
  }

  setFromNormalAndCoplanarPoint(normal, point) {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);

    return this;
  }

  clone() {
    return new CuttingPlane().copy(this);
  }

  copy(plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;
  }

  negate() {
    this.constant *= -1;
    this.normal.negate();

    return this;
  }

  // Split `polygon` by this plane if needed, then put the polygon or polygon
  // fragments in the appropriate lists. Coplanar polygons go into either
  // `coplanarFront` or `coplanarBack` depending on their orientation with
  // respect to this plane. Polygons in front or in back of this plane go into
  // either `front` or `back`.
  splitPolygon(polygon, coplanarFront, coplanarBack, front, back) {
    const COPLANAR = 0;
    const FRONT = 1;
    const BACK = 2;
    const SPANNING = 3;

    // tolerance used to decide if a point is on the plane.
    const EPSILON = 1e-5;

    // Classify each point as well as the entire polygon into one of the above
    // four classes.
    let polygonType = 0;
    const types = [];
    for (let i = 0; i < polygon.vertices.length; i++) {
      const t =
        this.normal.dot(polygon.vertices[i].pos) - this.constant;
      const type =
        t < -EPSILON ? BACK : t > EPSILON ? FRONT : COPLANAR;
      polygonType |= type;
      types.push(type);
    }

    // Put the polygon in the correct list, splitting it when necessary.
    switch (polygonType) {
      case COPLANAR:
        (this.normal.dot(polygon.plane.normal) > 0
          ? coplanarFront
          : coplanarBack
        ).push(polygon);
        break;
      case FRONT:
        front.push(polygon);
        break;
      case BACK:
        back.push(polygon);
        break;
      case SPANNING:
        const f = [];
        const b = [];
        for (let i = 0; i < polygon.vertices.length; i++) {
          const j = (i + 1) % polygon.vertices.length;
          const ti = types[i];
          const tj = types[j];
          const vi = polygon.vertices[i];
          const vj = polygon.vertices[j];
          if (ti != BACK) f.push(vi);
          if (ti != FRONT) b.push(ti != BACK ? vi.clone() : vi);
          if ((ti | tj) == SPANNING) {
            const t =
              (this.constant - this.normal.dot(vi.pos)) /
              this.normal.dot(vj.pos.clone().sub(vi.pos));
            const v = vi.interpolate(vj, t);
            f.push(v);
            b.push(v.clone());
          }
        }
        if (f.length >= 3) {
          const p = new Polygon(f);
          front.push(p);
        }

        if (b.length >= 3) {
          const p = new Polygon(b);
          back.push(p);
        }
        break;
    }
  }
}


// # class Polygon

// Represents a convex polygon. The vertices used to initialize a polygon must
// be coplanar and form a convex loop. They do not have to be `Vertex`
// instances but they must behave similarly (duck typing can be used for
// customization).

class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
    this.plane = new CuttingPlane().fromPoints(
      vertices[0].pos.clone(),
      vertices[1].pos.clone(),
      vertices[2].pos.clone(),
    );
  }

  clone() {
    const vertices = this.vertices.map(function (v) {
      return v.clone();
    });
    return new Polygon(vertices);
  }

  negate() {
    this.vertices.reverse().map(function (v) {
      v.negate();
    });
    this.plane.negate();
  }
}


// # class Vertex

// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property and `clone()`,
// `flip()`, and `interpolate()` methods that behave analogous to the ones
// defined by `Vertex`. This class provides `normal` so convenience
// functions like `CSG.sphere()` can return a smooth vertex normal, but `normal`
// is not used anywhere else.

class Vertex {
  constructor(pos, normal, uv) {
    this.pos = pos;
    if (normal) this.normal = normal;
    if (uv) this.uv = uv;
  }
  clone() {
    return new Vertex(
      this.pos.clone(),
      this.normal && this.normal.clone(),
      this.uv && this.uv.clone(),
    );
  }

  // Invert all orientation-specific data (e.g. vertex normal). Called when the
  // orientation of a polygon is flipped.
  negate() {
    this.normal = this.normal && this.normal.negate();
  }

  // Create a new vertex between this vertex and `other` by linearly
  // interpolating all properties using a parameter of `t`. Subclasses should
  // override this to interpolate additional properties.
  interpolate(other, t) {
    let normal = null;
    if (this.normal && other.normal) {
      normal = this.normal.clone().lerp(other.normal, t);
    }
    let uv = null;
    if (this.uv && other.uv) {
      uv = this.uv.clone().lerp(other.uv, t);
    }

    return new Vertex(
      this.pos.clone().lerp(other.pos, t),
      normal,
      uv,
    );
  }
}

// Constructive Solid Geometry (CSG) is a modeling technique that uses Boolean
// operations like union and intersection to combine 3D solids. This library
// implements CSG operations on meshes elegantly and concisely using BSP trees,
// and is meant to serve as an easily understandable implementation of the
// algorithm. All edge cases involving overlapping coplanar polygons in both
// solids are correctly handled.
//
// ## Implementation Details
//
// All CSG operations are implemented in terms of two functions, `clipTo()` and
// `invert()`, which remove parts of a BSP tree inside another BSP tree and swap
// solid and empty space, respectively. To find the union of `a` and `b`, we
// want to remove everything in `a` inside `b` and everything in `b` inside `a`,
// then combine polygons from `a` and `b` into one solid:
//
//     a.clipTo(b);
//     b.clipTo(a);
//     a.build(b.allPolygons());
//
// The only tricky part is handling overlapping coplanar polygons in both trees.
// The code above keeps both copies, but we need to keep them in one tree and
// remove them in the other tree. To remove them from `b` we can clip the
// inverse of `b` against `a`. The code for union now looks like this:
//
//     a.clipTo(b);
//     b.clipTo(a);
//     b.invert();
//     b.clipTo(a);
//     b.invert();
//     a.build(b.allPolygons());
//
// Subtraction and intersection naturally follow from set operations. If
// union is `A | B`, subtraction is `A - B = ~(~A | B)` and intersection is
// `A & B = ~(~A | ~B)` where `~` is the complement operator.
//
// ## License
//
// Copyright (c) 2011 Evan Wallace (http://madebyevan.com/), under the MIT license.

// # class CSG

// Holds a binary space partition tree representing a 3D solid. Two solids can
// be combined using the `union()`, `subtract()`, and `intersect()` methods.

class CSG {
  constructor() {
    this.polygons = [];
    this.material = [];
  }

  setFromGeometry(geometry) {
    if (!(geometry instanceof THREE.BufferGeometry)) {
      console.error("This library only works with three.js BufferGeometry");
      return;
    }

    if (geometry.index !== null) {
      geometry = geometry.toNonIndexed();
    }

    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const uvs = geometry.attributes.uv;

    // TODO
    // const colors = geometry.attributes.color;

    function createVertex(index) {
      const position = new THREE.Vector3(
        positions.getX(index),
        positions.getY(index),
        positions.getZ(index)
      );
      const normal = normals
        ? new THREE.Vector3(
            normals.getX(index),
            normals.getY(index),
            normals.getZ(index)
          )
        : null;

      const uv = uvs ? new THREE.Vector2(uvs.getX(index), uvs.getY(index)) : null;

      return new Vertex(position, normal, uv);
    }

    for (let i = 0; i < positions.count; i += 3) {
      const v1 = createVertex(i);
      const v2 = createVertex(i + 1);
      const v3 = createVertex(i + 2);

      this.polygons.push(new Polygon([v1, v2, v3]));
    }

    return this;
  }

  setFromMesh(mesh) {
    mesh.updateWorldMatrix();

    const transformedGeometry = mesh.geometry.clone();

    transformedGeometry.applyMatrix4(mesh.matrix);

    this.material.push(mesh.material);

    this.setFromGeometry(transformedGeometry);
    return this;
  }

  setPolygons(polygons) {
    this.polygons = polygons;
    return this;
  }

  toMesh() {
    return new THREE.Mesh(this.toGeometry(), this.material[0]);
  }

  toGeometry() {
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const uvs = [];

    const createFace = (a, b, c) => {
      positions.push(
        a.pos.x,
        a.pos.y,
        a.pos.z,
        b.pos.x,
        b.pos.y,
        b.pos.z,
        c.pos.x,
        c.pos.y,
        c.pos.z
      );

      // TODO: should not assume that all vertices have the same attributes
      if (a.normal) {
        normals.push(
          a.normal.x,
          a.normal.y,
          a.normal.z,
          b.normal.x,
          b.normal.y,
          b.normal.z,
          c.normal.x,
          c.normal.y,
          c.normal.z
        );
      }

      if (a.uv) {
        uvs.push(a.uv.x, a.uv.y, b.uv.x, b.uv.y, c.uv.x, c.uv.y);
      }
    };

    for (const polygon of this.polygons) {
      // triangulate the polygon
      for (let i = 0; i <= polygon.vertices.length - 3; i++) {
        createFace(
          polygon.vertices[0],
          polygon.vertices[i + 1],
          polygon.vertices[i + 2]
        );
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    if (normals.length) {
      geometry.setAttribute(
        "normal",
        new THREE.BufferAttribute(new Float32Array(normals), 3)
      );
    }
    if (uvs.length) {
      geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(uvs), 2)
      );
    }

    return geometry;
  }

  clone() {
    const csg = new CSG();
    csg.polygons = this.polygons.map(function (p) {
      return p.clone();
    });
    return csg;
  }

  // Return a new CSG solid representing space in either this solid or in the
  // solid `csg`
  //
  //     A.union(B)
  //
  //     +-------+            +-------+
  //     |       |            |       |
  //     |   A   |            |       |
  //     |    +--+----+   =   |       +----+
  //     +----+--+    |       +----+       |
  //          |   B   |            |       |
  //          |       |            |       |
  //          +-------+            +-------+
  //
  // A || B
  union(operands) {
    for (const operand of operands) {
      // console.log('operand: ', operand);
      if (!this.polygons.length) {
        this.setFromMesh(operand);
      } else {
        // todo: support multimaterial
        this.material.push(operand.material);
        this.unionOperand(new CSG().setFromMesh(operand));
      }
    }

    return this;
  }

  unionOperand(operand) {
    const a = new BSPNode(this.polygons);
    const b = new BSPNode(operand.polygons);
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    this.polygons = a.allPolygons();
    return this;
  }

  // Return a new CSG solid representing space in this solid but not in the
  // solid `csg`
  //
  //     A.subtract(B)
  //
  //     +-------+            +-------+
  //     |       |            |       |
  //     |   A   |            |       |
  //     |    +--+----+   =   |    +--+
  //     +----+--+    |       +----+
  //          |   B   |
  //          |       |
  //          +-------+
  //
  // A && !B
  subtract(operands) {
    for (const operand of operands) {
      if (!this.polygons.length) {
        this.setFromMesh(operand);
      } else {
        this.material.push(operand.material);
        this.subtractOperand(new CSG().setFromMesh(operand));
      }
    }

    return this;
  }

  subtractOperand(operand) {
    this.complement().unionOperand(operand).complement();
  }
  // subtractOperand(operand) {
  //   const a = new BSPNode(this.polygons);
  //   const b = new BSPNode(operand.polygons);
  //   a.invert();
  //   a.clipTo(b);
  //   b.clipTo(a);
  //   b.invert();
  //   b.clipTo(a);
  //   b.invert();
  //   a.build(b.allPolygons());
  //   a.invert();
  //   this.polygons = a.allPolygons();
  // }

  // Return a new CSG solid representing space both this solid and in the
  // solid `csg`
  //
  //     A.intersect(B)
  //
  //     +-------+
  //     |       |
  //     |   A   |
  //     |    +--+----+   =   +--+
  //     +----+--+    |       +--+
  //          |   B   |
  //          |       |
  //          +-------+
  //
  // A && B
  intersect(operands) {
    for (const operand of operands) {
      if (!this.polygons.length) {
        this.setFromMesh(operand);
      } else {
        this.material.push(operand.material);
        this.intersectOperand(new CSG().setFromMesh(operand));
      }
    }

    return this;
  }

  intersectOperand(operand) {
    const a = new BSPNode(this.polygons);
    const b = new BSPNode(operand.polygons);

    const d = new BSPNode(this.clone().polygons);
    const c = new BSPNode(operand.clone().polygons);

    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.build(b.allPolygons());
    a.invert();

    c.invert();
    d.clipTo(c);
    d.invert();
    c.clipTo(d);
    d.clipTo(c);
    c.build(d.allPolygons());
    c.invert();

    this.polygons = c.allPolygons().concat(a.allPolygons());
  }

  // Switch solid and empty space
  // !A
  complement() {
    this.polygons.map((p) => {
      p.negate();
    });
    return this;
  }
}
