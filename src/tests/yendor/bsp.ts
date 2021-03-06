import * as tsUnit from "../tsUnit";
import * as Yendor from "../../fwk/yendor/main";

export class BspTests extends tsUnit.TestClass {

    public bsnNodeProperties() {
        let root: Yendor.BSPNode = new Yendor.BSPNode(0, 0, 50, 50);

        this.isTrue( root.isLeaf() );
        this.isTrue( root.contains(25, 25) );
        this.isFalse( root.contains(51, 51) );
        this.isTrue( root.findNode(25, 25) === root );
    }

    public horizontalSplit() {
        let root: Yendor.BSPNode = new Yendor.BSPNode(10, 10, 50, 50);
        root.split(true, 10);

        this.isFalse( root.isLeaf(), "root.isLeaf()" );
        this.isTrue(root.leftChild !== undefined && root.rightChild !== undefined );
        if ( root.leftChild && root.rightChild ) {
            this.isTrue( root.leftChild.isLeaf(), "root.leftChild.isLeaf()" );
            this.isTrue( root.rightChild.isLeaf(), "root.rightChild.isLeaf()" );
            this.areIdentical( root.leftChild.x, 10, "root.leftChild.x");
            this.areIdentical( root.leftChild.y, 10, "root.leftChild.y");
            this.areIdentical( root.leftChild.w, 10, "root.leftChild.w");
            this.areIdentical( root.leftChild.h, 50, "root.leftChild.h");
            this.areIdentical( root.rightChild.x, 20, "root.rightChild.x");
            this.areIdentical( root.rightChild.y, 10, "root.rightChild.y");
            this.areIdentical( root.rightChild.w, 40, "root.rightChild.w");
            this.areIdentical( root.rightChild.h, 50, "root.rightChild.h");
        }
    }

    public verticalSplit() {
        let root: Yendor.BSPNode = new Yendor.BSPNode(0, 0, 50, 50);
        root.split(false, 40);

        this.isFalse( root.isLeaf(), "root.isLeaf()" );
        this.isTrue(root.leftChild !== undefined && root.rightChild !== undefined );
        if ( root.leftChild && root.rightChild ) {
            this.isTrue( root.leftChild.isLeaf(), "root.leftChild.isLeaf()" );
            this.isTrue( root.rightChild.isLeaf(), "root.rightChild.isLeaf()" );
            this.areIdentical( root.leftChild.x, 0, "root.leftChild.x" );
            this.areIdentical( root.leftChild.y, 0, "root.leftChild.y" );
            this.areIdentical( root.leftChild.w, 50, "root.leftChild.w" );
            this.areIdentical( root.leftChild.h, 40, "root.leftChild.h" );
            this.areIdentical( root.rightChild.x, 0, "root.rightChild.x" );
            this.areIdentical( root.rightChild.y, 40, "root.rightChild.y" );
            this.areIdentical( root.rightChild.w, 50, "root.rightChild.w" );
            this.areIdentical( root.rightChild.h, 10, "root.rightChild.h" );
        }
    }

    public recursiveSplit() {
        let root: Yendor.BSPNode = new Yendor.BSPNode(0, 0, 50, 50);
        root.splitRecursive(undefined, 2);

        this.isFalse( root.isLeaf(), "root.isLeaf()" );
        this.isTrue(root.leftChild !== undefined && root.rightChild !== undefined
            && root.leftChild.leftChild !== undefined && root.leftChild.rightChild !== undefined
            && root.rightChild.leftChild !== undefined && root.rightChild.rightChild !== undefined);
        if ( root.leftChild && root.rightChild && root.leftChild.leftChild && root.leftChild.rightChild
            && root.rightChild.leftChild && root.rightChild.rightChild) {
            this.isFalse( root.leftChild.isLeaf(), "root.leftChild.isLeaf()" );
            this.isTrue( root.leftChild.leftChild.isLeaf(), "root.leftChild.leftChild.isLeaf()" );
            this.isTrue( root.containsRect(root.leftChild), "root.contains(root.leftChild)");
            this.isTrue( root.containsRect(root.rightChild), "root.contains(root.rightChild)");
            this.isTrue( root.containsRect(root.leftChild.leftChild), "root.contains(root.leftChild.leftChild)");
            this.isTrue( root.containsRect(root.leftChild.rightChild), "root.contains(root.leftChild.rightChild)");
            this.isTrue( root.containsRect(root.rightChild.leftChild), "root.contains(root.rightChild.leftChild)");
            this.isTrue( root.containsRect(root.rightChild.rightChild), "root.contains(root.rightChild.rightChild)");
        }
    }

    public minSizeHoriz() {
        let root: Yendor.BSPNode = new Yendor.BSPNode(0, 0, 50, 70);
        root.splitRecursive(undefined, 2, 30);

        this.isTrue( root.isLeaf(), "root.isLeaf()" );
    }

    public minSizeVectic() {
        let root: Yendor.BSPNode = new Yendor.BSPNode(0, 0, 70, 50);
        root.splitRecursive(undefined, 2, 30);

        this.isTrue( root.isLeaf(), "root.isLeaf()" );
    }

    public traversePreOrder() {
        let root: Yendor.BSPNode = this.__buildTraverseTree();
        let s: string = "";
        let result: Yendor.BSPTraversalAction =
            root.traversePreOrder(
                function(node: Yendor.BSPNode, _userData: any) {
                    s = s + node.userData;
                    return Yendor.BSPTraversalAction.CONTINUE;
                }
            );

        this.isTrue( result === Yendor.BSPTraversalAction.CONTINUE, "result == Yendor.BSPTraversalAction.CONTINUE");
        this.isTrue( s === "1245367", "s==" + s + " instead of '1245367'");
    }

    public traverseInOrder() {
        let root: Yendor.BSPNode = this.__buildTraverseTree();
        let s: string = "";
        let result: Yendor.BSPTraversalAction =
            root.traverseInOrder(
                function(node: Yendor.BSPNode, _userData: any) {
                    s = s + node.userData;
                    return Yendor.BSPTraversalAction.CONTINUE;
                }
            );

        this.isTrue( result === Yendor.BSPTraversalAction.CONTINUE, "result == Yendor.BSPTraversalAction.CONTINUE");
        this.isTrue( s === "4251637", "s==" + s + " instead of '4251637'");
    }

    public traversePostOrder() {
        let root: Yendor.BSPNode = this.__buildTraverseTree();
        let s: string = "";
        let result: Yendor.BSPTraversalAction =
            root.traversePostOrder(
                function(node: Yendor.BSPNode, _userData: any) {
                    s = s + node.userData;
                    return Yendor.BSPTraversalAction.CONTINUE;
                }
            );

        this.isTrue( result === Yendor.BSPTraversalAction.CONTINUE, "result == Yendor.BSPTraversalAction.CONTINUE");
        this.isTrue( s === "4526731", "s==" + s + " instead of '4526731'");
    }

    public traverseLevelOrder() {
        let root: Yendor.BSPNode = this.__buildTraverseTree();
        let s: string = "";
        let result: Yendor.BSPTraversalAction =
            root.traverseLevelOrder(
                function(node: Yendor.BSPNode, _userData: any) {
                    s = s + node.userData;
                    return Yendor.BSPTraversalAction.CONTINUE;
                }
            );

        this.isTrue( result === Yendor.BSPTraversalAction.CONTINUE, "result == Yendor.BSPTraversalAction.CONTINUE");
        this.isTrue( s === "1234567", "s==" + s + " instead of '1234567'");
    }

    public traverseInvertedLevelOrder() {
        let root: Yendor.BSPNode = this.__buildTraverseTree();
        let s: string = "";
        let result: Yendor.BSPTraversalAction =
            root.traverseInvertedLevelOrder(
                function(node: Yendor.BSPNode, _userData: any) {
                    s = s + node.userData;
                    return Yendor.BSPTraversalAction.CONTINUE;
                }
            );

        this.isTrue( result === Yendor.BSPTraversalAction.CONTINUE, "result == Yendor.BSPTraversalAction.CONTINUE");
        this.isTrue( s === "7654321", "s==" + s + " instead of '7654321'");
    }

    private __buildTraverseTree(): Yendor.BSPNode {
        let root: Yendor.BSPNode = new Yendor.BSPNode(0, 0, 50, 50);
        root.splitRecursive(undefined, 2);
        root.userData = "1";
        if ( root.leftChild && root.rightChild && root.leftChild.leftChild && root.leftChild.rightChild
            && root.rightChild.leftChild && root.rightChild.rightChild) {
            root.leftChild.userData = "2";
            root.rightChild.userData = "3";
            root.leftChild.leftChild.userData = "4";
            root.leftChild.rightChild.userData = "5";
            root.rightChild.leftChild.userData = "6";
            root.rightChild.rightChild.userData = "7";
        }
        return root;
    }
}
