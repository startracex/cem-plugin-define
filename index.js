import { resolveModuleOrPackageSpecifier } from "@custom-elements-manifest/analyzer/src/utils/index.js";

export default function(pk = "define") {
  return {
    name: "cem-plugin-define",
    analyzePhase({ ts, node, moduleDoc, context }) {
      function visitNode(n) {
        if (n.jsDoc) {
          for (const doc of n.jsDoc) {
            if (doc.tags) {
              for (const tag of doc.tags) {
                const key = tag.tagName.escapedText;
                if (key === pk) {
                  const comments = tag.comment;
                  if (!Array.isArray(comments)) {
                    continue;
                  }
                  if (comments.length >= 2) {
                    const [c1, c2] = comments;
                    const elementTag = c1.text.trim();
                    const elementClass = c2.name.escapedText;
                    if (elementTag || elementClass) {
                      const exports = moduleDoc.exports || [];
                      const existingExport = exports.find(
                        (exportDoc) =>
                          exportDoc.kind === "custom-element-definition" &&
                          exportDoc.name === elementTag &&
                          exportDoc.declaration?.name === elementClass
                      );

                      if (!existingExport) {
                        const newDef = {
                          kind: "custom-element-definition",
                          name: elementTag,
                          declaration: {
                            name: elementClass,
                            ...resolveModuleOrPackageSpecifier(moduleDoc, context, elementClass)
                          }
                        };
                        moduleDoc.exports = [...exports, newDef];
                      }
                    }
                  }
                  break;
                }
              }
            }
          }
        }
        ts.forEachChild(n, visitNode);
      }

      visitNode(node);
    }
  };
}
