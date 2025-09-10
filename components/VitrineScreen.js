import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, FlatList, Image, Dimensions, ScrollView, 
  TouchableOpacity, Modal 
} from "react-native";

const imagensBolos = {
  boloPadrao: require('../imagens/ImagensBolos/boloPadrao.png'),
};

const { width } = Dimensions.get("window");
const isSmallScreen = width < 620;

export default function VitrineScreen() {
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState("Carregando...");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemUpdate, setSelectedItemUpdate] = useState(null);
  const [selectedItemDelete, setSelectedItemDelete] = useState(null);

  // ---------------- Modais ----------------

  function ModalProduto({ item, onClose }) {
    return (
      <Modal transparent animationType="slide" visible={true} onRequestClose={onClose}>
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.tituloModal}>{item.nome}</Text>
            <Image
              source={imagensBolos[item.imagem] ?? imagensBolos.boloPadrao}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.itemPrecoModal}>R${item.preco.toFixed(2)}</Text>
            <Text style={styles.itemDescricaoModal}>{item.descricao}</Text>
            <Text style={styles.itemEstoqueModal}>Estoque: {item.estoque}</Text>
            <TouchableOpacity style={styles.botaoFechar} onPress={onClose} activeOpacity={0.5}>
              <Text style={styles.textoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function ModalUpdateProduto({ item, onClose }) {
    return (
      <Modal transparent animationType="slide" visible={true} onRequestClose={onClose}>
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.tituloModal}>Editar {item.nome}</Text>
            <Image
              source={imagensBolos[item.imagem] ?? imagensBolos.boloPadrao}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.itemPrecoModal}>R${item.preco.toFixed(2)}</Text>
            <Text style={styles.itemDescricaoModal}>{item.descricao}</Text>
            <Text style={styles.itemEstoqueModal}>Estoque: {item.estoque}</Text>
            <TouchableOpacity style={styles.botaoFechar} onPress={onClose} activeOpacity={0.5}>
              <Text style={styles.textoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function ModalDeleteProduto({ item, onClose }) {
    return (
      <Modal transparent animationType="slide" visible={true} onRequestClose={onClose}>
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.tituloModal}>Excluir {item.nome}?</Text>
            <Image
              source={imagensBolos[item.imagem] ?? imagensBolos.boloPadrao}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.itemPrecoModal}>R${item.preco.toFixed(2)}</Text>
            <Text style={styles.itemDescricaoModal}>{item.descricao}</Text>
            <Text style={styles.itemEstoqueModal}>Estoque: {item.estoque}</Text>
            <TouchableOpacity style={styles.botaoFechar} onPress={onClose} activeOpacity={0.5}>
              <Text style={styles.textoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // ---------------- Fetch produtos ----------------

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("https://nodejs-production-43c7.up.railway.app/produtos");

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.success) {
          setProdutos(data.produtos);
          setStatus("Conectado com sucesso!");
        } else {
          setStatus("Erro no backend: " + JSON.stringify(data));
        }
      } catch (err) {
        setStatus("Erro: " + err.message);
      }
    };

    fetchProdutos();
  }, []);

  // ---------------- Render ----------------

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.status}>{status}</Text>

      <FlatList
        numColumns={2}
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardVitrine}
            activeOpacity={0.6}
            onLongPress={() => setSelectedItem(item)}
          >
            <Image
              source={imagensBolos[item.imagem] ?? imagensBolos.boloPadrao}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.itemName}>{item.nome}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.buttonUpdate}
                activeOpacity={0.3}
                onPress={() => setSelectedItemUpdate(item)}
              >
                Editar
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonDelete}
                activeOpacity={0.3}
                onPress={() => setSelectedItemDelete(item)}
              >
                Excluir
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedItem && <ModalProduto item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {selectedItemUpdate && (
        <ModalUpdateProduto item={selectedItemUpdate} onClose={() => setSelectedItemUpdate(null)} />
      )}
      {selectedItemDelete && (
        <ModalDeleteProduto item={selectedItemDelete} onClose={() => setSelectedItemDelete(null)} />
      )}
    </ScrollView>
  );
}

// ---------------- Styles ----------------

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
    gap: 10,
    padding: 5,
  },
  buttonDelete: {
    height: 30,
    width: isSmallScreen ? 60 : 100,
    backgroundColor: "#fa1212c0",
    borderRadius: 6,
    textAlign: "center",
    lineHeight: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
  },
  buttonUpdate: {
    height: 30,
    width: isSmallScreen ? 60 : 100,
    backgroundColor: "#1db643f3",
    borderRadius: 6,
    textAlign: "center",
    lineHeight: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#E9F1FE",
    padding: 10,
  },
  row: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 15,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#042136",
  },
  cardVitrine: {
    flex: 1,
    backgroundColor: "#2689cbd6",
    padding: 10,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderRadius: 12,
    width: "50%",
    height: isSmallScreen ? 200 : 220,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "900",
    color: "#e9f1fe",
    textAlign: "center",
  },
  itemPrecoModal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f0505ff",
  },
  itemDescricaoModal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f0505ff",
    textAlign: "center",
  },
  itemEstoqueModal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f0505ff",
  },
  modalFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#e1eefb",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  tituloModal: {
    fontSize: 25,
    fontWeight: "bold",
  },
  botaoFechar: {
    marginTop: 15,
    backgroundColor: "#f64545ff",
    padding: 10,
    borderRadius: 8,
  },
  textoFechar: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
